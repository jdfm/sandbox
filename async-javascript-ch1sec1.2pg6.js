/**
 * The code in this file is based on code from the book Async JavaScript 
 * 		by Trevor Burnham. The original version can be found at ch1sec1.2pg6.
 * 		This version does a bit more, but what is being tested is basically the
 * 		same. It counts how many times you can get your callback to fire if you 
 * 		keep creating an async event using the same async mechanism.
 *
 * I could have run the tests with promises, but I think I prefer what I have 
 * 		here for now. Since the purpose is to test async mechanisms that 
 * 		JavaScript provides, using something that doesn't use any of the same 
 * 		async mechanisms to test those very mechanisms seems more correct to me.
 */

var fireCount = 0;
var start = new Date;
var testDuration = 1000;

function runTests(suites, suiteDone){
	var sLen = suites.length;

	while(sLen && typeof suites[0] !== 'function'){
		suiteDone(suites.shift());

		sLen--;
	}

	if(sLen === 0){ return; }

	(suites.shift())(function(result){
		suiteDone(result);

		runTests(suites, suiteDone);
	});
}

console.log('Tested | Nr. of Runs | Time Elapsed (ms)');
runTests(
	[
		typeof(requestAnimationFrame) !== 'undefined' ? 
			testAnimationFrame : 
			['requestAnimationFrame', 0],
		testInterval, 
		testTimeout, 
		typeof(setImmediate) !== 'undefined' ? 
			testImmediate : 
			['setImmediate', 0], 
		testPromise,
		typeof(global) !== 'undefined' ? 
			testTick : 
			['nextTick', 0]
	], function(result){
		console.log('%s | %d | %d', result[0], result[1], new Date - start);

		start = new Date;
		fireCount = 0;
	}
);

function testInterval(done){
	var timer = setInterval(function() {
		if (new Date - start < testDuration) { 
			fireCount++;
		} else {
			clearInterval(timer);

			done(['setInterval', fireCount]);
		}
	}, 0);
}

function testTick(done){
	if(new Date - start < testDuration){
		fireCount++;

		process.nextTick(function(){ // async recursion
			testTick(done);
		});
	} else {
		done(['nextTick', fireCount]);
	}
}

function testImmediate(done){
	setImmediate(function(){
		if (new Date - start < testDuration) { 
			fireCount++;

			testImmediate(done); // async recursion
		} else {
			done(['setImmediate', fireCount]);
		}
	});
}

function testTimeout(done){
	setTimeout(function(){
		if (new Date - start < testDuration) { 
			fireCount++;

			testTimeout(done); // async recursion
		} else {
			done(['setTimeout', fireCount]);
		}
	}, 0);
}

function testAnimationFrame(done){
	if (new Date - start < testDuration) { 
		fireCount++;
		
		requestAnimationFrame(function(timestamp){
			testAnimationFrame(done); // async recursion
		});
	} else {
		done(['requestAnimationFrame', fireCount]);
	}
}

function testPromise(done){
	var promise = Promise.resolve(fireCount);

	promise.then(function me(value){
		value++;

		if(new Date - start < testDuration){
			promise = promise.then(me);
		} else {
			promise = promise.then(function(value){
				done(['Promise', value]);
			});
		}

		return value;
	});
}