/*
Convert positive integers to roman numerals

Lots of hax - did this in under 45min

WIP - numbers such as 49, 99, 499, and 999 do not convert properly and tests fail

See https://repl.it/EzXz/113 to run it
*/

// Roman Table
// V (5) X (10) L (50) C (100) D (500) M (1000)

var rome = ''; // Kelner hax global var ehehe

function convertToRome(num) {
  // reset rome
  rome = '';
  var origNum = num;
  num = reduceThatIsh(num);
  if( num % 5 !== 0 ) {
    rome += doSmallies(num, origNum);
  }
  console.log(rome);
  return rome;
}

function doSmallies(num, origNum) {
  switch(num) {
    case 1:
      return 'I';
    case 2:
      return 'II';
    case 3:
      return 'III';
    case 4:
      // hax - did this under 45min so sux
      if (origNum % 10 === 4) {
        return 'IV';
      }
      return '';
  }
}

function reduceThatIsh(num) {
  num = whileReduce(num, 1000, 'M', 0, ''); // hax
  num = whileReduce(num, 500, 'D', 1000, 'M');
  num = whileReduce(num, 100, 'C', 500, 'D');
  num = whileReduce(num, 50, 'L', 100, 'C');
  num = whileReduce(num, 10, 'X', 50, 'L');
  num = whileReduce(num, 5, 'V', 10, 'X');
  return num;
}

function whileReduce(num, romeNum, romeVal, romeAboveNum, romeAboveVal) {
  while( num >= romeNum ) {
    if( num + 1 === romeAboveNum ) {
      rome += 'I' + romeAboveVal;
      num -= romeNum;
    } else {
      num -= romeNum;
      rome += romeVal;
    }
  }
  return num;
}

function test(roman, val) {
  var pass = (roman === val);
  if ( !pass ) {
    console.log("TEST FAILED: " + roman + " !== " + val);
  }
}

// TESTS!!!
test(convertToRome(1),'I');
test(convertToRome(2),'II');
test(convertToRome(3),'III');
test(convertToRome(4),'IV');
test(convertToRome(5),'V');
test(convertToRome(6),'VI');
test(convertToRome(7),'VII');
test(convertToRome(8),'VIII');
test(convertToRome(9),'IX');
test(convertToRome(10),'X');
test(convertToRome(11),'XI');
test(convertToRome(12),'XII');
test(convertToRome(13),'XIII');
test(convertToRome(14),'XIV');
test(convertToRome(15),'XV');
test(convertToRome(16),'XVI');
test(convertToRome(17),'XVII');
test(convertToRome(18),'XVIII');
test(convertToRome(19),'XIX');
test(convertToRome(20),'XX');
// 50
test(convertToRome(49),'XLIX'); // not IL
test(convertToRome(50),'L');
test(convertToRome(51),'LI');
test(convertToRome(54),'LIV');
test(convertToRome(55),'LV');
test(convertToRome(56),'LVI');
test(convertToRome(59),'LIX');
test(convertToRome(60),'LX');
// 100
test(convertToRome(99),'XCIX');
test(convertToRome(100),'C');
test(convertToRome(101),'CI');
test(convertToRome(104),'CIV');
test(convertToRome(105),'CV');
test(convertToRome(106),'CVI');
test(convertToRome(109),'CIX');
test(convertToRome(110),'CX');
test(convertToRome(111),'CXI');
// 150
test(convertToRome(149),'CXLIX');
test(convertToRome(150),'CL');
test(convertToRome(151),'CLI');
test(convertToRome(154),'CLIV');
test(convertToRome(155),'CLV');
test(convertToRome(156),'CLVI');
// 500
test(convertToRome(499),'CDXCIX');
test(convertToRome(500),'D');
test(convertToRome(501),'DI');
test(convertToRome(504),'DIV');
test(convertToRome(505),'DV');
test(convertToRome(506),'DVI');
test(convertToRome(509),'DIX');
test(convertToRome(510),'DX');
test(convertToRome(511),'DXI');
// 550
test(convertToRome(549),'DXLIX');
test(convertToRome(550),'DL');
test(convertToRome(551),'DLI');
test(convertToRome(554),'DLIV');
test(convertToRome(555),'DLV');
test(convertToRome(556),'DLVI');
// 1000
test(convertToRome(999),'CMXCIX');
test(convertToRome(1000),'M');
test(convertToRome(1001),'MI');
test(convertToRome(1004),'MIV');
test(convertToRome(1005),'MV');
test(convertToRome(1006),'MVI');
test(convertToRome(1009),'MIX');
test(convertToRome(1010),'MX');
test(convertToRome(1011),'MXI');
test(convertToRome(1019),'MXIX');
test(convertToRome(1020),'MXX');
test(convertToRome(1021),'MXXI');
// 1050
test(convertToRome(1049),'MXLIX');
test(convertToRome(1050),'ML');
test(convertToRome(1051),'MLI');
// 1550
test(convertToRome(1549),'MDXLIX');
test(convertToRome(1550),'MDL');
test(convertToRome(1551),'MDLI');
test(convertToRome(1554),'MDLIV');
test(convertToRome(1555),'MDLV');
test(convertToRome(1556),'MDLVI');
test(convertToRome(1559),'MDLIX');
test(convertToRome(1560),'MDLX');
test(convertToRome(1561),'MDLXI');
// 2000
test(convertToRome(1999),'MCMXCIX');
test(convertToRome(2000),'MM');
test(convertToRome(2004),'MMIV');
test(convertToRome(2005),'MMV');


