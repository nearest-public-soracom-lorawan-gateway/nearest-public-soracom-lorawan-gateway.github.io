// Extracted data from: https://www.google.com/maps/d/viewer?mid=1XzicjpognepwJmV3dkMdmLr1q38&ll=35.13135337573484%2C134.60711234999997&z=4
var LoRaGateways = [
    { name: "SORACOM", lng: 139.7441662, lat: 35.66981089999999 },
    { name: "SORACOM", lng: 139.6257645, lat: 35.615806 },
    { name: "株式会社レキサス", lng: 127.8597236, lat: 26.3420374 },
    { name: "Safecast", lng: 139.6954932, lat: 35.6560611 },
    { name: "Cloudpack", lng: 135.4948354, lat: 34.7039763 },
    { name: "クラスメソッド株式会社", lng: 139.77471500000001, lat: 35.69729 },
    { name: "株式会社ウフル", lng: 139.74415799999997, lat: 35.6637477 },
    { name: "クラスメソッド株式会社", lng: 141.3545011, lat: 43.0657565 },
    { name: "Cloudpack", lng: 139.7494519, lat: 35.6667976 },
    { name: "Cloudpack", lng: 136.8941116, lat: 35.1684454 },
    { name: "クラスメソッド株式会社", lng: 135.4962248, lat: 34.6890335 },
];

// ref: http://qiita.com/sy_sft_/items/b0a6f2143db0e1a191e8

function getDistance(lat1, lng1, lat2, lng2) {
    function radians(deg) {
        return deg * Math.PI / 180;
    }

    return 6378.14 * Math.acos(Math.cos(radians(lat1)) *
        Math.cos(radians(lat2)) *
        Math.cos(radians(lng2) - radians(lng1)) +
        Math.sin(radians(lat1)) *
        Math.sin(radians(lat2)));
}

var onLocationSuccess = function (pos) {
    var lng = pos.coords.longitude;
    var lat = pos.coords.latitude;
    if (isNaN(lng) || isNaN(lat)) {
        return;
    }
    // console.log(lng);
    // console.log(lat);
    var nearestGateway = {};
    var nearestDistance = Number.MAX_VALUE;
    LoRaGateways.forEach(function (v) {
        var d = getDistance(lat, lng, v.lat, v.lng);
        // console.log(v);
        // console.log(d);
        if (d < nearestDistance) {
            nearestGateway = v;
            nearestDistance = d;
        }
    });
    showNearestPublicGateway(nearestDistance, nearestGateway);
}

var showNearestPublicGateway = function(dist, gateway) {
    var distInMeter = Math.round(dist * 1000);
    var tweetMsg = "最寄りのSORACOM LoRaWANパブリックゲートウェイまでの距離は" + distInMeter.toLocaleString() + "mでした。";
    document.getElementById("result").innerHTML = "最寄りのSORACOM LoRaWANパブリックゲートウェイは「" + gateway.name + "」で、距離は約" + distInMeter.toLocaleString() + "mです。<br><br>" +
        "→<a href=\"https://maps.google.co.jp/maps?ll=" + gateway.lat + "," + gateway.lng + "&q=" + gateway.name + "\">Google Mapsでゲートウェイの場所を開く</a><br><br>" +
        "→<a href=\"https://twitter.com/intent/tweet?url=https://nearest-public-soracom-lorawan-gateway.github.io/&hashtags=SORACOMLoRaWANGW&text=" + encodeURIComponent(tweetMsg) + "\">結果をツイートする</a>";
}

var onLocationError = function (pos) {
    alert('failed to get current location');
}

var invokeFind = function() {
    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, { enableHighAccuracy: true });
}
