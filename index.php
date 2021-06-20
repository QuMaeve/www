<head>
    <title>Журнал Жилищного надзора и Лицензионного контроля</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8, windows-1251 "/>
    <meta name="author" content="Ian Main"/>
    <meta name="Copyright" content="Creative Commons - http://creativecommons.org/licenses/by/2.0/"/>
    <link rel="stylesheet" href="jqwidgets-scripts/jqwidgets/styles/jqx.base.css" type="text/css"/>
    <link rel="stylesheet" href="jqwidgets-scripts/jqwidgets/styles/jqx.arctic.css" type="text/css"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script type="text/javascript" src="jqwidgets-scripts/jqwidgets/jqx-all.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
            crossorigin="anonymous"></script>
    <script src="forms/js/add_obr.js"></script>
    <script src="forms/js/form_el.js"></script>
    <script src="forms/js/add_pred.js"></script>
    <script src="forms/js/add_rasp.js"></script>
    <script src="forms/js/add_act4.js"></script>
    <script src="forms/js/add_predpis1.js"></script>
    <script src="forms/js/add_predpis_old.js"></script>
    <script src="forms/js/add_U_protocol.js"></script>
    <script src="forms/js/add_U_pred1.js"></script>
    <script src="forms/js/add_zadan.js"></script>
    <script src="forms/js/add_protocol.js"></script>
    <script src="forms/js/general10.js"></script>
    <script src="js/function_load_page4.js"></script>
    <script src="forms/js/report_fun.js"></script>
    <script src="forms/js/report_rmw3.js"></script>
    <script src="forms/js/monitoring.js"></script>
    <script src="forms/js/report_constructor.js"></script>

    <style type="text/css">
        <!--
        /*body {*/
        /*    font-family: Verdana, Arial, Helvetica, sans-serif;*/
        /*    margin: 0;*/
        /*    font-size: 80%;*/
        /*    font-weight: bold;*/
        /*    background: #ffffff;*/
        /*}*/
    </style>

    <style type="text/css; charset=utf-8, windows-1251 ">
        body {
            /*background-color: #ffffff;*/
            /*background-image: url();*/
        }
    </style>
    <style>
        /*.button_menu {*/
        /*    width: 100%;*/
        /*    font-size: larger;*/
        /*}*/

        ul {
            list-style: none;
            margin: 0;
            padding: 0;
            align: center;
        }



        .avtorization {
            width: 50%;
            height: auto;
            background: #dee0e2;
            /*position: absolute;*/
            top: 50%;
            /*left: 40%;*/
            border: 3px solid #812f6d;
            border-radius: 4px;
            margin: 10% 20% 10% 20%;
        }

        .avtorization h3 {
            color: #000000;
            font-family: ‘Arial’, sans-serif;
            /*font-weight: bold;*/
            /*letter-spacing: -1px;*/
            /*line-height: 1;*/
            text-align: center;
            margin: 7% 0 1% 0;
        }

        #log {
            width: auto;
            height: auto;
            /*margin-bottom: 2px;*/
            /*margin-top: 3%;*/
            /*margin-left: 10%;*/
            text-align: center;
            vertical-align: middle;
            outline: none;
            border: 1px solid transparent;
            border-radius: 4px
        }

        #pw {
            width: auto;
            height: auto;
            /*margin-bottom: 2px;*/
            /*margin-top: 3%;*/
            /*margin-left: 10%;*/
            text-align: center;
            vertical-align: middle;
            outline: none;
            border: 1px solid transparent;
            border-radius: 4px
        }

        #btnlogin {
            position: relative;
            border-radius: 4px;
            width: auto;
            text-align: center;
            /*margin-top: 4%;*/
            /*margin-bottom: 1%;*/
            vertical-align: middle;
            /*margin-left: 10%;*/
        }

        .text_autorizate {
            text-align: center;
            vertical-align: middle;
        }
    </style>
    <style>
        /* Боковое навигационное меню */
        .sidenav {
            height: 100%; /* 100% Full-height */
            width: 0; /* 0 ширина - изменить это с помощью JavaScript */
            position: fixed; /* Оставайтесь на месте */
            z-index: 1; /* Оставайтесь сверху */
            top: 0; /* Оставайтесь наверху */
            left: 0;
            background-color: #812f6d; /* Фон черный*/
            overflow-x: hidden; /* Отключить горизонтальную прокрутку */
            padding-top: 60px; /* Поместите контент в 60px сверху */
            transition: 0.5s; /* 0.5 второй эффект перехода слайда в боковой навигации */
        }

        /* Ссылки меню навигации */
        .sidenav a {
            padding: 8px 8px 8px 32px;
            text-decoration: none;
            font-size: 25px;
            color: #818181;
            display: block;
            transition: 0.3s;
        }

        /* Когда вы наводите курсор мыши на навигационные ссылки, изменяется их цвет */
        .sidenav a:hover {
            color: #f1f1f1;
        }

        /* Положение и стиль кнопки закрытия (верхний правый угол) */
        .sidenav .closebtn {
            position: absolute;
            top: 0;
            right: 25px;
            font-size: 36px;
            margin-left: 50px;
        }

        /* Стиль содержимого страницы - используйте это, если вы хотите сдвинуть содержимое страницы вправо при открытии боковой навигации */
        .main {
            transition: margin-left .5s;
            padding: 20px;
            margin-left: 5%;
        }

        /* На экранах меньшего размера, где высота меньше 450px, измените стиль sidenav (меньше отступов и меньший размер шрифта) */
        @media screen and (max-height: 450px) {
            .sidenav {
                padding-top: 15px;
            }

            .sidenav a {
                font-size: 18px;
            }
        }
    </style>
</head>

<body>

<? include_once("forms\link\link.php"); ?>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">

        <a class="navbar-brand" href="#">
            <span class="navbar-toggler-icon" style="position: fixed" onclick="openNav()"></span>
            <img src="img/gerb.png" alt="" width="50" style="margin-left: 5%" class="d-inline-block align-text-top">
            Государственная инспекция Забайкальского края - Журнал Жилищного надзора и Лицензионного контроля
        </a>
    </div>
</nav>
<div id="mySidenav" class="sidenav">
    <a href="javascript:void(0)" class="closebtn" style="position: fixed" onclick="closeNav()">&times;</a>
    <? if ($_COOKIE['username'] == "") {
    } else {
        include_once("forms/menu.php");
    } ?>

</div>

<div class="main">
    <form id="authorization" name="authorization" method="post"
        <? if ($_COOKIE['username'] == "") {
            echo 'style="display:block"';
        } else {
            echo 'style="display:none"';
        } ?>
    >
        <div class="avtorization">
            <h3>Вход в систему</h3>
            <p align="center">
            <p class="text_autorizate"> &#1051;&#1086;&#1075;&#1080;&#1085;</p>
            <!--  Логин-->
            <p align="center">
                <? echo ' <select  name="log" id="log" >';
                echo '<option value="">Выберите пользователя</option>';
                include_once("forms/workers.php");
                echo '</select>'; ?>
            </p>
            <p class="text_autorizate">&#1055;&#1072;&#1088;&#1086;&#1083;&#1100;</p>
            <p align="center">
                <input placeholder="Пароль" type="password" name="pw" id="pw"
                       onKeyUp="autorization_key('log','pw',event)"/>
            </p>
            <p align="center">
                <button id="btnlogin" onclick="autorizationbase('log','pw')">
                    Подтвердить
                </button>
            </p>
            </p>
        </div>
    </form>
    <div style="border-bottom: solid 1px black; margin-bottom: 2%;" name="autorizate" id="autorizate"
        <? if ($_COOKIE['username'] == "") {
            echo 'style="display:none"';
        } else {
            echo 'style="display:inline"';
        } ?> >
        <? echo 'Вы работаете под именем:'; ?>
        <b id="user_name_val">
            <? if ($_COOKIE['username'] == "") {
            } else {
                echo $_COOKIE['username'];
            } ?>
        </b>
        <input style="margin: 1% 30% 1% 1%" type="button" name="exitbase" value="Выход" onClick="deleteCookie()"/>

        <div id="user_create_div" align="right" <? if ($_COOKIE['userhead'] == "") {
            echo 'style="display:none"';
        } else {
            echo 'style="display:inline"';
        } ?>>
            Создание документа от имени пользователя:

            <form>
                <select  name="user_create" id="user_create" onChange=""><?
                    $op1 = '<option  selected="selected" value="' . $_COOKIE['userid'] . '">&#1058;&#1077;&#1082;&#1091;&#1097;&#1080;&#1081; &#1087;&#1086;&#1083;&#1100;&#1079;&#1086;&#1074;&#1072;&#1090;&#1077;&#1083;&#1100; </option>';
                    $q_text = 'SELECT `id`,`FIO` FROM `workers` where (`id`<>"' . $_COOKIE['userid'] . '") order by  `FIO`';
                    //echo $q_text.' ';
                    $q = mysql_query($q_text) or die (mysql_error());
                    while ($r = mysql_fetch_row($q)) {
                        if ($r[0] == "") {
                        } else {
                            $op1 = $op1 . '<option value="' . $r[0] . '">' . $r[1] . '</option>';
                        }
                    }
                    echo $op1; ?>
                </select>
            </form>

        </div>
    </div>
    <div id="main_page_val">
    </div>
    <div id="l_menu">
    </div>
    <div id="menu_add_data">
    </div>

    <form id="form1" name="form1" method="post" action="">
        <!--            <p>&nbsp;</p>-->
        <!--            <p>&nbsp;</p>-->
    </form>

</div>
<script>/* Установите ширину боковой навигации до 250 пикселей */
    function openNav() {
        document.getElementById("mySidenav").style.width = "350px";
    }

    /* Установите ширину боковой навигации на 0 */
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }</script>
</body>
</html>