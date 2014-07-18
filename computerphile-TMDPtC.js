/**
 * Ackermann {
 *   storage: {Array of Arrays of Numbers},
 *   loopy: {Function},
 *   recursive: {Function Ackermann}
 * } 
 *
 * After watching the episode of computerphile (https://www.youtube.com/watch?v=i7sm9dzFtEI)
 *   entitled "The Most Difficult Program to Compute?" I was curious whether or not there was 
 *   a way to create an implementation of Ackermann without recursive calls. I seem to have 
 *   succeeded. It just took 5.6x more code to get the job done, and possibly wastes more 
 *   memory, but it works.
 *
 * Basically the idea was to recreate how functions create call stacks, mix that with 
 *   some local storage to quickly get to answers we've already calculated before, and 
 *   boom, we have a non recursive Ackermann function, I call it loopy for short.
 *
 * The stack code isn't very pretty, I could have probably created a class with peek, 
 *   push and pop and whatnot that would make the code nicer to look at, but it works.
 *
 * Maybe I should say that this is an almost-recursive implementation?
 */
var Ackermann = (function(){

  // just an input checking function
  var isNaturalNumber = (function( NEGATIVE_INFINITY, POSITIVE_INFINITY ){
    return function( n ){
      return typeof n === 'number' && // Are you even an number? Rules out non numeric types.
        n > NEGATIVE_INFINITY && // n larger than negative infinity? Rules out NaN and negative infinity.
        n < POSITIVE_INFINITY &&  // n smaller than positive infinity? Rules out NaN and positive infinity.
        n >= 0 && // we want only positive integers
        !( n % 1 ); // n has a remainder of 0 when calculating modulo 1? Rules out floating points.
    };
  }( -1/0, 1/0 )); // just making sure we're getting negative and positive infinity

  return {
    storage: [],

    loopy: function ( m, n ){
      if( !isNaturalNumber( m ) || !isNaturalNumber( n ) ){ return 0; }

      // we only need storage up to m
      for(var i = m; i >= 0 && !this.storage[ i ]; ){ this.storage[ i-- ] = [] }

      var mnStack = [ m, n ], 
          sLen = 2, cM, cN;

      while( sLen > 1 ){
        // roll back some more of that stack
        if( sLen % 2 ){ // our stack should have an even number of elements
          if(typeof mnStack[ sLen - 2 ] !== 'number'){
            cM = mnStack[ sLen - 2 ][ 0 ];
            cN = mnStack[ sLen - 2 ][ 1 ];

            this.storage[ cM ][ cN ] = mnStack[ sLen - 1 ];
          } else {
            cM = mnStack[ sLen - 3 ];
            cN = mnStack[ sLen - 2 ];

            this.storage[ cM ][ cN ] = mnStack.pop();
          }

          mnStack.pop();
          mnStack.pop();

          sLen = mnStack.push( this.storage[ cM ][ cN ] );

          continue;
        }

        // start using the last available arguments from the stack
        if( typeof mnStack[ sLen - 1 ] === 'number' ){
          cM = mnStack[ sLen - 2 ]; 
          cN = mnStack[ sLen - 1 ];
        } else {
          cM = mnStack[ sLen - 1 ][ 0 ]; 
          cN = mnStack[ sLen - 1 ][ 1 ];
        }

        // can we roll back some stack?
        if( !cM || typeof this.storage[ cM ][ cN ] !== 'undefined' ){
          if( typeof mnStack.pop() === 'number' ){
            mnStack.pop();
          }

          if( !this.storage[ cM ][ cN ] ){
            this.storage[ cM ][ cN ] = cN + 1;
          }

          sLen = mnStack.push( this.storage[ cM ][ cN ] );

          continue;
        }

        // we need to make the stack grow again
        sLen = mnStack.push( cM - 1, !cN ? 1 : [ cM, cN - 1 ] );
      }

      // return the final answer
      return ( this.storage[ m ][ n ] || ( this.storage[ m ][ n ] = mnStack[ 0 ] ) );
    },

    recursive: function Ackermann( m, n ){
      if( !isNaturalNumber( m ) || !isNaturalNumber( n ) ){ return 0; }

      if( !m ) {
        return n + 1;
      } else if( !n ) {
        return Ackermann( m - 1, 1 );
      } else {
        return Ackermann( m - 1, Ackermann( m, n - 1 ) );
      }
    }
  };
}());

// A couple of tests to make sure it's returning the expected results
console.log(Ackermann.loopy(0,0), Ackermann.loopy(0,0) === Ackermann.recursive(0,0));
console.log(Ackermann.loopy(0,1), Ackermann.loopy(0,1) === Ackermann.recursive(0,1));
console.log(Ackermann.loopy(0,2), Ackermann.loopy(0,2) === Ackermann.recursive(0,2));
console.log(Ackermann.loopy(0,3), Ackermann.loopy(0,3) === Ackermann.recursive(0,3));
console.log(Ackermann.loopy(0,4), Ackermann.loopy(0,4) === Ackermann.recursive(0,4));
console.log(Ackermann.loopy(0,5), Ackermann.loopy(0,5) === Ackermann.recursive(0,5));
console.log(Ackermann.loopy(1,0), Ackermann.loopy(1,0) === Ackermann.recursive(1,0));
console.log(Ackermann.loopy(1,1), Ackermann.loopy(1,1) === Ackermann.recursive(1,1));
console.log(Ackermann.loopy(1,2), Ackermann.loopy(1,2) === Ackermann.recursive(1,2));
console.log(Ackermann.loopy(1,3), Ackermann.loopy(1,3) === Ackermann.recursive(1,3));
console.log(Ackermann.loopy(1,4), Ackermann.loopy(1,4) === Ackermann.recursive(1,4));
console.log(Ackermann.loopy(1,5), Ackermann.loopy(1,5) === Ackermann.recursive(1,5));
console.log(Ackermann.loopy(2,0), Ackermann.loopy(2,0) === Ackermann.recursive(2,0));
console.log(Ackermann.loopy(2,1), Ackermann.loopy(2,1) === Ackermann.recursive(2,1));
console.log(Ackermann.loopy(2,2), Ackermann.loopy(2,2) === Ackermann.recursive(2,2));
console.log(Ackermann.loopy(2,3), Ackermann.loopy(2,3) === Ackermann.recursive(2,3));
console.log(Ackermann.loopy(2,4), Ackermann.loopy(2,4) === Ackermann.recursive(2,4));
console.log(Ackermann.loopy(2,5), Ackermann.loopy(2,5) === Ackermann.recursive(2,5));

// don't go beyond 4,1, therein lies pain...
// console.log(Ackermann.recursive(4, 1)); --> call stack exceeded
