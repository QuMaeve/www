function start_constructor() {
    $('#result_constructor').html("Подождите! Идет загрузка...");
    var sel_constructor = document.getElementById('sel_constructor').value;
    var d1 = document.getElementById('d_1').value;
    var d2 = document.getElementById('d_2').value;
    var fio_worker_m = document.getElementById('fio_worker_m').value;
    var w_m = "0";
    var viol_document_gi = [];
    var y = 0;
    var worker_monitor = document.getElementById("worker_monitor");
    if (worker_monitor.checked) {
        var w_m = "1";
    } else {
        var w_m = "0";
    }
    var document_gi = document.getElementsByClassName("document_gi");
    for (var k = 0; k < document_gi.length; k++) {
        if (document_gi[k].checked) {
            viol_document_gi[y] = document_gi[k].value;
            y++;
        }
    };
    alert(viol_document_gi);
    if (d1 == "") {
        alert("Указанны не все данные!!!");
    } else if (d2 == "") {
        alert("Указанны не все данные!!!");
    } else {
        $.ajax({
            type: 'post',
            url: "forms/report_constructor/start.php",
            data: {
                d1: d1,
                d2: d2,
                viol_document_gi: viol_document_gi,
                y: y,
                fio_worker_m: fio_worker_m,
                w_m: w_m,
                sel_monitoring: sel_constructor

            },
            success: function (res) {
                $('#result_constructor').html(res);
                alert("Отчёт сформирован");
            }

        });
    }

}

function otdel_constructor() {
    var otdel1 = document.getElementById("sel_constructor").value;
    var del_w_m = document.getElementById("del_w_m");
    if (del_w_m.checked) {
        var del_w = "1";
    } else {
        var del_w = "0";
    }
    //  alert(del_w);
    $.ajax({
        type: 'post',
        url: "forms/general/workers_depart.php",
        data: {
            id_depart: otdel1,
            del_w: del_w

        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#fio_worker_m').html(res);

        }

    });
}

function pole_constructor1() {
    var id_doc = document.getElementById("doc1").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names1').html(res);
            // alert('ky1');
        }

    });
}

function pole_constructor2() {
    var id_doc = document.getElementById("doc2").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names2').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor3() {
    var id_doc = document.getElementById("doc3").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names3').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor4() {
    var id_doc = document.getElementById("doc4").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names4').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor5() {
    var id_doc = document.getElementById("doc5").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names5').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor6() {
    var id_doc = document.getElementById("doc6").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names6').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor7() {
    var id_doc = document.getElementById("doc7").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names7').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor8() {
    var id_doc = document.getElementById("doc8").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names8').html(res);
            // alert('ky');
        }

    });
}

function pole_constructor9() {
    var id_doc = document.getElementById("doc9").value;
    $.ajax({
        type: 'post',
        url: "forms/general/pole_doc.php",
        data: {
            id_doc: id_doc
        },
        success: function (res) {
            // alert(del_w+'***'+res);
            $('#pole_names9').html(res);
            // alert('ky');
        }

    });
}

function Excel() {
    // document.getElementById('start_b_constructor').disabled = true;
    // document.getElementById('ex').disabled = true;
    var text_tab = $('#result_constructor').html();
    $.ajax({
        type: 'post',
        url: "forms/general/export_f.php",
        data: {text_tab: text_tab},
        success: function (res) {

            //    alert(res);
            // $('#result_rw').html(res);
            download('export.xls', res);
            alert("Файл сформирован");
            document.getElementById('start_r').disabled = false;
            document.getElementById('ex').disabled = false;
        }

    });


}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
// function add_new_report(){
//     alert('функция в стадии доработки :0')
//     // include_once("..\link\link.php");
//     // $text_q = 'CREATE TABLE new_report_"кому доступен шаблон отчета'"$add_new_report"'"();
//
// }