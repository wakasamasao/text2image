let base64, fileName;
let selectedNum = 0;

window.onload = function () {    // 外部の設定ファイルがあるかどうか調査
    if (localStorage && localStorage.getItem("setting")) {
        // try {
        //     setting = JSON.parse(localStorage.getItem("setting"));
        // } catch (error) {
        localStorage.removeItem("setting");
        // }
    }

    if (typeof (setting) == "undefined") {
        alert('setting.jsが読み込めませんでした。ファイルや環境を確認してください。');
    } else {
        saveSetting();
        document.getElementById("settingText").onchange = function (e) {
            try {
                setting = JSON.parse(document.getElementById("settingText").value);
                saveSetting();
                init();
            } catch (error) {
                let ok = confirm('正しいJSONにしてください。元に戻しますか？');
                if (ok) {
                    saveSetting();
                }
            }
        }
        document.getElementById("dlclick").onclick = function () {
            dlStart();
        }
        init();
    }

    document.getElementById("clearLocalData").onclick = function () {
        localStorage.removeItem("setting");
        location.reload();
    }
}


// --------------------
//  初期化
// --------------------
function init() {
    // 選択のボタンの設置
    let id, key, mode;
    if (location.search && location.search.length > 0) {
        let params = location.search.substr(1).split("&");
        for (let i in params) {
            let p = params[i].split("=");
            if (p[0] == "id") {
                id = p[1];
            }
            if (p[0] == "mode") {
                mode = p[1];
            }
        }

        for (let i in setting.templates) {
            if (setting.templates[i].id == id) {
                key = Number(i);
            }
        }
    }

    if (typeof (key) == "number") {
        selectType(key);
    } else {
        let selectArea = document.getElementById("selectArea");
        while (selectArea.firstChild) selectArea.removeChild(selectArea.firstChild);
        for (let i in setting.templates) {
            let btn = document.createElement("button");
            let num = i;
            btn.onclick = function () {
                selectType(num);
            }
            btn.textContent = setting.templates[i].name;
            selectArea.appendChild(btn);
        }
        selectType(selectedNum);
    }

    if (mode) {
        if (mode == "setting") {
            document.getElementById("settingArea").style.display = 'block';
        }
    }
}

function saveSetting() {
    // localStorage.setItem("setting", JSON.stringify(setting));
    document.getElementById("settingText").value = JSON.stringify(setting, undefined, 1);
}

// --------------------
//  ボタンで対象画像を選んだ時
// --------------------
function selectType(num) {
    selectedNum = num;
    inputData = {
        "texts": [],
        "blocks": []
    };

    let inputArea = document.getElementById("inputArea");
    while (inputArea.firstChild) inputArea.removeChild(inputArea.firstChild);

    let tm = setting.templates[num];
    for (let i in tm.texts) {
        let data = tm.texts[i];


        let textDom;
        if (data.row == 1) {
            textDom = document.createElement("input");
            textDom.setAttribute("type", "text");
        } else {
            textDom = document.createElement("textarea");
        }
        if (tm.texts[i].defaultformat) {
            let nowText = formatDate(new Date(), tm.texts[i].defaultformat);
            textDom.value = nowText;
            tm.texts[i].value = nowText;
        } else {
            textDom.value = tm.texts[i].value;
        }
        textDom.setAttribute("key", i);
        // textDom.onchange = updateTextAreaEvet;
        textDom.onkeyup = updateTextAreaEvet;

        if (data.row > 1) {
            textDom.style.height = (Number(data.row) * 0.9 + 1.5) + "em";
        }

        if (tm.setting.order == "vertical") {
            let colDom = document.createElement("div");
            textDom.style.width = "100%";
            colDom.appendChild(textDom);
            inputArea.appendChild(colDom);
        } else {
            inputArea.appendChild(textDom);
        }

    }
    genePic();
}

function updateTextAreaEvet(e) {
    let key = Number(this.getAttribute("key"));
    let data = setting.templates[selectedNum].texts[key];

    if (data.row > 1) {
        let lines = this.value.split("\n");
        if (lines.length > data.row) {
            stopTextOver("[!]改行多いため行数を減らしてください。");
        } else {
            data.value = this.value;
            genePic();
        }
    } else {
        data.value = this.value;
        genePic();
    }
}

function stopTextOver(text) {
    document.getElementById("geneInfo").textContent = text;
    document.getElementById("imagePanel").style.display = "none";
    document.getElementById("imageArea").style.display = "none";
}


// --------------------
//  画像の生成
// --------------------
function genePic() {
    document.getElementById("geneInfo").textContent = "";
    document.getElementById("imagePanel").style.display = "block";
    document.getElementById("imageArea").style.display = "block";
    saveSetting();

    let baseData = setting.templates[selectedNum];
    // 背景画像の読み込み
    if (baseData.setting.background.image) {
        var bgimg = new Image();
        bgimg.src = baseData.setting.background.image;
        bgimg.onerror = function () {
            alert('背景画像が読み込めません。画像を確認してください。');
        }
        bgimg.onload = function () {

            let ca = document.getElementById("geneCanvas");
            let ctx = ca.getContext("2d");
            // 画像のサイズに合わせる
            ca.width = bgimg.width;
            ca.height = bgimg.height;
            // 背景画像の描画
            ctx.drawImage(bgimg, 0, 0);

            drowPic(ca, ctx, baseData);

        }
    } else if (baseData.setting.background.width && baseData.setting.background.height) {
        let ca = document.getElementById("geneCanvas");
        let ctx = ca.getContext("2d");
        ca.width = baseData.setting.background.width;
        ca.height = baseData.setting.background.height;
        if (baseData.setting.background.color) {
            ctx.fillStyle = baseData.setting.background.color;
        } else {
            ctx.fillStyle = "rgb(255,255,255)";
        }
        ctx.fillRect(0, 0, baseData.setting.background.width, baseData.setting.background.height);

        drowPic(ca, ctx, baseData);
    } else {
        let ca = document.getElementById("geneCanvas");
        let ctx = ca.getContext("2d");
        ca.width = 100;
        ca.height = 100;
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, 100, 100);
    }


}

function drowPic(ca, ctx, baseData) {
    ctx.fillStyle = "rgb(0,0,0)";
    try {

        // テキストの取得と設定
        for (let i in baseData.texts) {
            let data = baseData.texts[i];
            let vals = (data.value.replace(/\r\n/g, "\n").replace(/\r/g, "\n")).split("\n");
            let posy = data.y;
            if (data.valign == "middle") {
                posy = posy - ((vals.length / 2) * Number(data["font-size"]));
            } else if (data.valign == "bottom") {
                posy = posy - (vals.length * Number(data["font-size"]));
            }
            for (let row in vals) {
                ctx.fillStyle = data.color;
                ctx.font = (data["font-weight"] ? data["font-weight"] + " " : "") + data["font-size"] + "px " + data["font-family"] + "";
                ctx.textAlign = data.align;
                ctx.fillText(vals[row], data.x, posy + (row * Number(data["font-size"])), data.width);
            }
        }
        // var text = document.getElementById("topic1").value;


        // 出力フォーマットを拡張子から推定

        fileName = baseData.output.prefix + "." + baseData.output.exec;
        if (baseData.output.exec == "jpg") {
            base64 = ca.toDataURL(["image/jpeg", baseData.output.quality]);

        } else if (baseData.output.exec == "png") {
            base64 = ca.toDataURL();
        } else {
            alert('出力するファイル名が正しく設定されていません。')
        }

        // $("#geneImage").attr("src", base64);

        // ダウンロードボタン用の設定 (IE対応のため隠しリンクに設定を行う)
        var link = document.getElementById("dllink");
        var blob = Base64toBlob(base64);
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        // 出力までできたのでボタンを表示する
        var btn = document.getElementById("dlclick");
        btn.style.display = 'inline';

    } catch (e) {
        // 途中の画像出力で正しく動かなかったのでダウンロードボタン以外で対応を表示
        console.log("ERROR :");
        console.log(e);
        var info = document.getElementById("geneInfo");
        info.textContent = '右クリックで名前をつけて保存を選んでください。';

    }
}

/*

// --------------------
//  ボタンで背景画像を選んだ時
// --------------------
function selectBg(num) {
    selectedNum = num;
    genePic();
}

// --------------------
//  初期化
// --------------------
function init() {
    const now = new Date();
    document.getElementById("filename").value = "img" + now.getTime();


    // 背景選択のボタンの設置
    var html = "";
    for (var i in setting.material.background) {
        var bg = setting.material.background[i];
        html += "<button class='selectbtn' onclick='selectBg(\"" + i + "\")'>" + bg.name + "</button>";
    }
    document.getElementById("selectBgArea").innerHTML = html;

    // 入力テキストのイベント設定
    document.getElementById("topic1").addEventListener("keydown", genePic, false);
    document.getElementById("topic1").addEventListener("onchange", genePic, false);
    document.getElementById("filename").addEventListener("keydown", genePic, false);
    // ダウンロードボタンの設定
    document.getElementById("dlclick").addEventListener("click", dlStart, false);

    // 画像作成
    genePic();

}

// --------------------
//  画像の生成
// --------------------
function genePic() {

    // 現在選択されている背景の画像データ
    var selectBackground = setting.material.background[selectedNum];

    // 背景画像の読み込み
    var bgimg = new Image();
    bgimg.src = "bg/" + selectBackground.file;
    bgimg.onerror = function () {
        alert('背景画像が読み込めません。画像を確認してください。');
    }
    bgimg.onload = function () {

        ca = document.getElementById("geneCanvas");
        // 画像のサイズに合わせる
        ca.width = bgimg.width;
        ca.height = bgimg.height;

        ctx = ca.getContext("2d");

        try {
            // 背景画像の描画
            ctx.drawImage(bgimg, 0, 0);

            // テキストの取得と設定
            var text = document.getElementById("topic1").value;
            ctx.fillStyle = selectBackground.color;
            ctx.font = selectBackground.font;
            ctx.fillText(text, selectBackground.x, selectBackground.y, bgimg.width - (selectBackground.x * 2));

            // 出力フォーマットを拡張子から推定
            if (setting.output.exec == "jpg") {
                base64 = ca.toDataURL(["image/jpeg", setting.output.quality]);

            } else if (setting.output.exec == "png") {
                base64 = ca.toDataURL();
            } else {
                alert('出力するファイル名が正しく設定されていません。')
            }

            // ダウンロードボタン用の設定 (IE対応のため隠しリンクに設定を行う)
            var link = document.getElementById("dllink");
            var blob = Base64toBlob(base64);
            link.href = window.URL.createObjectURL(blob);
            link.download = document.getElementById("filename").value + "." + setting.output.exec;

            // 出力までできたのでボタンを表示する
            var btn = document.getElementById("dlclick");
            btn.style.display = 'inline';

        } catch (e) {
            // 途中の画像出力で正しく動かなかったのでダウンロードボタン以外で対応を表示
            console.log("ERROR :");
            console.log(e);
            var info = document.getElementById("geneInfo");
            info.textContent = 'お使いの環境では生成後に上記を右クリックをし名前をつけて保存を選んでください。';

        }
    }
}
*/

// --------------------
//  ダウンロード開始
// --------------------
function dlStart() {
    //  ダウンロード開始
    if (window.navigator.msSaveBlob) {
        // IE
        // base64データをblobに変換してダウンロード
        window.navigator.msSaveBlob(Base64toBlob(base64), fileName);
    } else {
        // Chrome, Firefox, Edge
        // aタグをクリックしてダウンロード開始
        document.getElementById("dllink").click();
    }
}



function formatDate(date, format, is12hours) {
    var weekday = ["日", "月", "火", "水", "木", "金", "土"];
    if (!format) {
        format = 'YYYY/MM/DD(WW) hh:mm:dd'
    }
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate();
    var weekday = weekday[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var secounds = date.getSeconds();

    var ampm = hours < 12 ? 'AM' : 'PM';
    if (is12hours) {
        hours = hours % 12;
        hours = (hours != 0) ? hours : 12;
    }

    var replaceStrArray =
    {
        'YYYY': year,
        'Y': year,
        'MM': ('0' + (month)).slice(-2),
        'M': month,
        'DD': ('0' + (day)).slice(-2),
        'D': day,
        'WW': weekday,
        'hh': ('0' + hours).slice(-2),
        'h': hours,
        'mm': ('0' + minutes).slice(-2),
        'm': minutes,
        'ss': ('0' + secounds).slice(-2),
        's': secounds,
        'AP': ampm,
    };

    var replaceStr = '(' + Object.keys(replaceStrArray).join('|') + ')';
    var regex = new RegExp(replaceStr, 'g');

    ret = format.replace(regex, function (str) {
        return replaceStrArray[str];
    });

    return ret;
}

// --------------------
// Base64データをBlobデータに変換
// --------------------
// https://st40.xyz/one-run/article/133/
function Base64toBlob(base64) {
    var tmp = base64.split(',');
    var data = atob(tmp[1]);
    var mime = tmp[0].split(':')[1].split(';')[0];
    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    var blob = new Blob([buf], { type: mime });
    return blob;
}
