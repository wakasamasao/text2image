// 設定

let setting = {
    "templates": [
        {
            "id": "linemenunormal",
            "name": "LINE メニュー",
            "output": {
                "prefix": "rich_normal",
                "exec": "jpg",
                "quality": 0.6
            },
            "setting": {
                "background": {
                    "image": "image/linemenu.jpg",
                    "color": "#990000",
                    "width": 1200,
                    "height": 810
                },
                "order": "horizontal"
            },
            "texts": [
                {
                    "x": 415,
                    "y": 470,
                    "width": 550,
                    "row": 2,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 90,
                    "font-family": "sans-serif",
                    "color": "#333366",
                    "value": "休日当番医"
                },
                {
                    "x": 1250,
                    "y": 470,
                    "width": 550,
                    "row": 2,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 90,
                    "font-family": "sans-serif",
                    "color": "#333366",
                    "value": "子育て情報"
                },
                {
                    "x": 2100,
                    "y": 470,
                    "width": 550,
                    "row": 2,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 90,
                    "font-family": "sans-serif",
                    "color": "#333366",
                    "value": "イベント\nニュース"
                },
                {
                    "x": 415,
                    "y": 1345,
                    "width": 550,
                    "row": 2,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 90,
                    "font-family": "sans-serif",
                    "color": "#333366",
                    "value": "ふるさと納税"
                },
                {
                    "x": 1250,
                    "y": 1345,
                    "width": 550,
                    "row": 2,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 90,
                    "font-family": "sans-serif",
                    "color": "#333366",
                    "value": "防災情報"
                },
                {
                    "x": 2100,
                    "y": 1345,
                    "width": 550,
                    "row": 3,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 90,
                    "font-family": "sans-serif",
                    "color": "#FFFFFF",
                    "font-weight": "bold",
                    "value": "公式LINEの\n使い方"
                }
            ]
        },
        {
            "id": "snsdisaster",
            "name": "SNS投稿画像",
            "output": {
                "prefix": "square_normal_",
                "exec": "jpg",
                "quality": 0.7
            },
            "setting": {
                "background": {
                    "image": "image/square.jpg",
                    "color": "#990000",
                    "width": 1080,
                    "height": 1080
                },
                "order": "vertical"
            },
            "texts": [
                {
                    "x": 135,
                    "y": 56,
                    "width": 630,
                    "row": 1,
                    "align": "left",
                    "valign": "top",
                    "font-size": 44,
                    "font-family": "sans-serif",
                    "color": "#000000",
                    "value": "XX町からのお知らせ"
                },
                {
                    "x": 135,
                    "y": 94,
                    "width": 630,
                    "row": 1,
                    "align": "left",
                    "valign": "top",
                    "font-size": 36,
                    "font-family": "sans-serif",
                    "color": "#000000",
                    "value": "http://www."
                },
                {
                    "x": 915,
                    "y": 56,
                    "width": 280,
                    "row": 2,
                    "align": "center",
                    "valign": "top",
                    "font-size": 40,
                    "font-family": "sans-serif",
                    "color": "#000000",
                    "defaultformat": "YYYY年MM月DD日\nhh時00分 発表",
                    "value": "2019年11月03日\n15時00分 発表"
                },
                {
                    "x": 540,
                    "y": 255,
                    "width": 1000,
                    "row": 2,
                    "align": "center",
                    "valign": "middle",
                    "font-size": 60,
                    "font-family": "sans-serif",
                    "color": "#000000",
                    "font-weight": "bold",
                    "value": "台風XX号から変化した温帯低気圧の接近に伴い\n避難所をMM時から開設します。"
                },
                {
                    "x": 40,
                    "y": 660,
                    "width": 1000,
                    "row": 14,
                    "align": "left",
                    "valign": "middle",
                    "font-size": 50,
                    "font-family": "sans-serif",
                    "color": "#000000",
                    "value": "自主避難希望の方のため、以下の避難所MM時から開設します。\n避難の際は、できるだけ身の回り品や食料等の非常持ち出し品をご準備ください。\n\n・●●小学校(●●町xxx)\n・●●小学校(●●町xxx)\n・●●公民館(●●町xxx)\n・●●公民館(●●X丁目xx)\n・●●公民館(●●xxxx)\n\n【対象】●●町全域、●●町X〜X丁目"
                }
            ]
        }
    ]
};