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
 *   loopy uses one while loop with various if blocks to calculate the answer, it 
 *   never calls itself ever.
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
      for( var i = m; i >= 0 && !this.storage[ i ]; ){ this.storage[ i-- ] = []; }

      var mnStack = [ m, n ], 
          sLen = 2, cM, cN;

      while( sLen > 1 ){
        // do we have an odd number of elements in our stack? if so we 
        //    should start rolling back the stack
        if( sLen % 2 ){
          if( typeof mnStack[ sLen - 2 ] !== 'number' ){
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
for(var i = 0, iLen = 3; i < iLen; i++){
  for(var j = 0, jLen = 6; j < jLen; j++){
    console.log(Ackermann.loopy(i,j), Ackermann.loopy(i,j) === Ackermann.recursive(i,j));
  }
}

// don't go beyond 4,1, therein lies pain...
// console.log(Ackermann.recursive(4, 1)); --> call stack exceeded
