function HexToRgb(hexstr) {
  var a = [];
  hexstr = hexstr.replace(/[^0-9a-f]+/gi, "");
  if (hexstr.length === 3) {
    a = hexstr.split("");
  } else if (hexstr.length === 6) {
    a = hexstr.match(/(\w{2})/g);
  } else {
    throw new Error(
      "invalid input, hex string must be in the format #FFFFFF or #FFF"
    );
  }
  return a.map(function(x) {
    return parseInt(x, 16);
  });
}

function IntToHex(i) {
  var hex = i.toString(16);
  if (hex.length === 1) hex = "0" + hex;
  return hex;
}

export default function mix(colorA, colorB, weight) {
  var a = HexToRgb(colorA);
  var b = HexToRgb(colorB);

  var c0 = Math.round((a[0] + Math.abs(a[0] - b[0]) * weight) % 255);
  var c1 = Math.round((a[1] + Math.abs(a[1] - b[1]) * weight) % 255);
  var c2 = Math.round((a[2] + Math.abs(a[2] - b[2]) * weight) % 255);

  return "#" + IntToHex(c0) + IntToHex(c1) + IntToHex(c2);
}
