function loadData(pathToData) {
	var result;
	$.ajax({
    	type: "GET",
    	url: pathToData,
    	dataType: "text",
    	async: false,
    	success: function(d) {
    		result = d3.csv.parseRows(d);
    	}
    });
	return result;
}

function convertToFloat2d(array) {
	return array.map(function(d) {
		return d.map(function (e) {
			return +e;
		});
	});
}

function pca(data) {
	var result = numeric.eig(numeric.dot(numeric.transpose(data), data));

	var indices = findIdxOfLargestThree(result.lambda.x);
	// console.log(indices);
	var V = result.E.x;	
	var W = numeric.transpose([V[indices[0]], V[indices[1]], V[indices[2]]]);
	return W;
}

// TODO the efficency can be largely improved by smart insertion.
function findIdxOfLargestThree(array) {
	var temp = [ {key:0, value: array[0]},
		{key:1, value: array[1]},
		{key:2, value: array[2]},
		{key:3, value: array[3]}
	];
	for (var i = 3; i < array.length; i++) {
		temp[3] = {key:i, value: array[i]};
		temp.sort(function(a, b) {
			return b.value - a.value;
		});
	}
	return [temp[0].key, temp[1].key, temp[2].key];
}

function getProjection(data, W) {
   	return numeric.dot(data, W);
}

function centering(data) {
	var sum = data.reduce(function(p, c) {
		return p.map(function(d, i) {
			return p[i] + c[i];
		});
	});
	var mean = sum.map(function(d) {return d/data.length});
	return data.map(function(row){
		return row.map(function(d, i){
			return d - mean[i];
		});
	});
}

function ones(m, n) {
	var result = [];
	var i = m;
	while (i--) {
		result.push(Array(n).fill(+1));
	}
	return result;
}

function zeros(m, n) {
	var result = [];
	var i = m;
	while (i--) {
		result.push(Array(n).fill(+0));
	}
	return result;
}

function orth(A) {
	var r = numeric.svd(A);
	var U = r.U.filter(function (d, i) {
		return !(r.S[i] === 0);

	});
	return U;
}

function eye(n) {
	var result = zeros(n, n);
	result.forEach(function (d, i) {
		d[i] = +1;
	});
	return result;
}

function find(A) {
  var result = new Map;
  var count = 0;
  A.forEach(function (d,i) {
    d.forEach(function (e,j) {
      if (e === 1) {
        result.set(count++, {i : i, j : j });
      }
    });
  });
  return result;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function sum(A, dim) {
  if (dim === 1) {
    return A.reduce(function (p, v) {
      return p.map(function (d, i) {return d + v[i];});
    });
  } else if (dim === 2) {
    return A.map(function (d, i) {
      return d.reduce(function (p, v) {return p + v;});
    });
  } else {
    return null;
  }
}

function randn(m, n) {
	var z = new Ziggurat();
	var result = [];
	for (var i = 0; i < m; i++) {
		var temp = [];
		for (var j = 0; j < n; j++) {
			temp.push(z.nextGaussian());
		}
		result.push(temp);
	}
	return result;
}

// matrix norm
function normM(A) {
  var r = numeric.svd(A);
  var result = r.S.sort();
  return  result[result.length-1];
}

// col
function column(A, j) {
  return A.map(function(d) {
    return d[j];
  });
}


// vectorize
// TODO: replace it by reshape()
function vectorize(A) {
  var result = [];
  A.forEach(function(d) {
    result = result.concat(d);
  });
  return result;
}
// matrixize
// TODO:replace it byreshape()
function matrixize(v, n, d) {
  var result = [];
  var idx = 0
  while (idx < v.length) {
    result.push(v.slice(idx, idx+d))
    idx += d;
  }
  return result;
}

// copied from https://github.com/jamesbloomer/node-ziggurat
function Ziggurat(){

  var jsr = 123456789;

  var wn = Array(128);
  var fn = Array(128);
  var kn = Array(128);

  function RNOR(){
    var hz = SHR3();
    var iz = hz & 127;
    return (Math.abs(hz) < kn[iz]) ? hz * wn[iz] : nfix(hz, iz);
  }

  this.nextGaussian = function(){
    return RNOR();
  }

  function nfix(hz, iz){
    var r = 3.442619855899;
    var r1 = 1.0 / r;
    var x;
    var y;
    while(true){
      x = hz * wn[iz];
      if( iz == 0 ){
        x = (-Math.log(UNI()) * r1); 
        y = -Math.log(UNI());
        while( y + y < x * x){
          x = (-Math.log(UNI()) * r1); 
          y = -Math.log(UNI());
        }
        return ( hz > 0 ) ? r+x : -r-x;
      }

      if( fn[iz] + UNI() * (fn[iz-1] - fn[iz]) < Math.exp(-0.5 * x * x) ){
         return x;
      }
      hz = SHR3();
      iz = hz & 127;
 
      if( Math.abs(hz) < kn[iz]){
        return (hz * wn[iz]);
      }
    }
  }

  function SHR3(){
    var jz = jsr;
    var jzr = jsr;
    jzr ^= (jzr << 13);
    jzr ^= (jzr >>> 17);
    jzr ^= (jzr << 5);
    jsr = jzr;
    return (jz+jzr) | 0;
  }

  function UNI(){
    return 0.5 * (1 + SHR3() / -Math.pow(2,31));
  }

  function zigset(){
    // seed generator based on current time
    jsr ^= new Date().getTime();

    var m1 = 2147483648.0;
    var dn = 3.442619855899;
    var tn = dn;
    var vn = 9.91256303526217e-3;
    
    var q = vn / Math.exp(-0.5 * dn * dn);
    kn[0] = Math.floor((dn/q)*m1);
    kn[1] = 0;

    wn[0] = q / m1;
    wn[127] = dn / m1;

    fn[0] = 1.0;
    fn[127] = Math.exp(-0.5 * dn * dn);

    for(var i = 126; i >= 1; i--){
      dn = Math.sqrt(-2.0 * Math.log( vn / dn + Math.exp( -0.5 * dn * dn)));
      kn[i+1] = Math.floor((dn/tn)*m1);
      tn = dn;
      fn[i] = Math.exp(-0.5 * dn * dn);
      wn[i] = dn / m1;
    }
  }

  zigset();
}