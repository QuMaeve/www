<div id="rating_work">
    <form>
        <!--Конструктор отчетных форм-->
        <h1 align="center">&#1050;&#1086;&#1085;&#1089;&#1090;&#1088;&#1091;&#1082;&#1090;&#1086;&#1088; &#1086;&#1090;&#1095;&#1077;&#1090;&#1085;&#1099;&#1093;
            &#1092;&#1086;&#1088;&#1084; </h1>
        <!--ввод даты-->
        <p>&#1057;
            <input name="d_1" type="date" id="d_1" value="<? $d = date_create();
            echo $d->format('Y-m-d');
            ?>"/>
            &#1055;&#1086;
            <input name="d_2" type="date" id="d_2" value="<? $d = date_create();
            echo $d->format('Y-m-d');
            ?>"/>
        </p>
        <!--выбор отдела-->
        <p>&#1042;&#1099;&#1073;&#1077;&#1088;&#1080;&#1090;&#1077; &#1086;&#1090;&#1076;&#1077;&#1083;</p>
        <select id="sel_constructor" onchange="otdel_constructor()">
            <? include_once("..\link\link.php");
            $id_user = $_COOKIE['userid'];
            $text_q = 'SELECT  `id_department` FROM  `workers` WHERE  `id` = "' . $id_user . '"';
            //$val=""
            $q_obj = mysql_query($text_q) or die (Mysql_error());
            while ($r_obj = mysql_fetch_row($q_obj)) {
                if ($r_obj[0] == 0) {
                } else {
                    $val = $r_obj[0];
                }
            }
            if ($val == 1) {
                echo '
         <option value="1">&#1042;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081;</option>
      ';
            } else {
                if ($val == 2) {
                    echo '<option value="2">&#1044;&#1086;&#1082;&#1091;&#1084;&#1077;&#1085;&#1090;&#1072;&#1088;&#1085;&#1099;&#1081;</option>';
                } else {
                    echo '<option value="0" selected="selected">&#1042;&#1089;&#1077;</option>
         <option value="1">&#1042;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081;</option>
         <option value="2">&#1044;&#1086;&#1082;&#1091;&#1084;&#1077;&#1085;&#1090;&#1072;&#1088;&#1085;&#1099;&#1081;</option>';
                }
            }
            ?>
        </select>
        <!--исполнительные документы-->
        <div style="border:hidden">
            <p>&#1048;&#1089;&#1087;&#1086;&#1083;&#1085;&#1080;&#1090;&#1077;&#1083;&#1100;&#1085;&#1099;&#1077;
                &#1076;&#1086;&#1082;&#1091;&#1084;&#1077;&#1085;&#1090;&#1099;:</p>
            <table>
                <tr>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc1" value="1" checked="checked" onclick="pole_constructor1()"/>
                        <b>&#1054;&#1073;&#1088;&#1072;&#1097;&#1077;&#1085;&#1080;&#1103; </b>
                        <div id="pole_names1">
                        </div>
                    </td>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc2" value="2" checked="checked" onclick="pole_constructor2()"/>
                        <b>&#1056;&#1072;&#1089;&#1087;&#1086;&#1088;&#1103;&#1078;&#1077;&#1085;&#1080;&#1103;</b>
                        <div id="pole_names2">
                        </div>
                    </td>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc3" value="3" checked="checked" onclick="pole_constructor3()"/>
                        <b>&#1047;&#1072;&#1076;&#1072;&#1085;&#1080;&#1103;</b>
                        <div id="pole_names3">
                        </div>
                    </td>

                </tr>
                <tr>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc4" value="4" checked="checked" onclick="pole_constructor4()"/>
                        <b>&#1059;&#1074;&#1077;&#1076;&#1086;&#1084;&#1083;&#1077;&#1085;&#1080;&#1103; </b>
                        <div id="pole_names4">
                        </div>
                    </td>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc5" value="5" checked="checked" onclick="pole_constructor5()"/>
                        <b>&#1055;&#1088;&#1077;&#1076;&#1086;&#1089;&#1090;&#1077;&#1088;&#1077;&#1078;&#1077;&#1085;&#1080;&#1103;</b>
                        <div id="pole_names5">
                        </div>
                    </td>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc6" value="6" checked="checked" onclick="pole_constructor6()"/>
                        <b>&#1040;&#1082;&#1090;&#1099;</b>
                        <div id="pole_names6">
                        </div>
                    </td>

                </tr>
                <tr>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc7" value="7" checked="checked" onclick="pole_constructor7()"/>
                        <b>&#1055;&#1088;&#1077;&#1076;&#1087;&#1080;&#1089;&#1072;&#1085;&#1080;&#1103; </b>
                        <div id="pole_names7">
                        </div>
                    </td>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc8" value="8" checked="checked" onclick="pole_constructor8()"/>
                        <b>&#1059;&#1074;&#1077;&#1076;&#1086;&#1084;&#1083;&#1077;&#1085;&#1080;&#1103; &#1085;&#1072;
                            &#1087;&#1088;&#1086;&#1090;&#1086;&#1082;&#1086;&#1083;&#1099;</b>
                        <div id="pole_names8">
                        </div>
                    </td>
                    <td>
                        <input type="checkbox" class="document_gi" id="doc9" value="9" checked="checked" onclick="pole_constructor9()"/>
                        <b>&#1055;&#1088;&#1086;&#1090;&#1086;&#1082;&#1086;&#1083;&#1099;</b>
                        <div id="pole_names9">
                        </div>
                    </td>

                </tr>
            </table>

        </div>
        <div style="display: none">
            <p>
                <input type="checkbox" id="worker_monitor"
                       onchange='div_nide("worker_monitor","w_h");otdel_constructor();'/>
                &#1042;&#1099;&#1073;&#1088;&#1072;&#1090;&#1100; &#1082;&#1086;&#1085;&#1082;&#1088;&#1077;&#1090;&#1085;&#1086;&#1075;&#1086;
                &#1089;&#1086;&#1090;&#1088;&#1091;&#1076;&#1085;&#1080;&#1082;&#1072;</p>
            <div id="w_h" style="display:none">&nbsp;
                <input type="checkbox" id="del_w_m" onclick="otdel_constructor()"/>
                &#1059;&#1095;&#1080;&#1090;&#1099;&#1074;&#1072;&#1090;&#1100; &#1091;&#1076;&#1072;&#1083;&#1077;&#1085;&#1085;&#1099;&#1093;
                &#1089;&#1086;&#1090;&#1080;&#1088;&#1091;&#1076;&#1085;&#1080;&#1082;&#1086;&#1074;
                <p>&#1042;&#1099;&#1073;&#1077;&#1088;&#1080;&#1090;&#1077; &#1089;&#1086;&#1090;&#1088;&#1091;&#1076;&#1085;&#1080;&#1082;&#1072;
                    <select id="fio_worker_m">
                    </select>
                </p>
            </div>
        </div>
        <p>
            <input type="button" name="start_b_constructor" id="start_b_constructor"
                   value="&#1057;&#1092;&#1086;&#1088;&#1084;&#1080;&#1088;&#1086;&#1074;&#1072;&#1090;&#1100; "
                   onclick="start_constructor()"/>
            <input type="button" align="right" name="ex" id="ex"
                   value="  &#1069;&#1082;&#1089;&#1087;&#1086;&#1088;&#1090;" onclick="Excel()"/>
<!--            <input type="button" name="add_new_report" id="add_new_report"-->
<!--                   value="&#1044;&#1086;&#1073;&#1072;&#1074;&#1080;&#1090;&#1100; &#1082;&#1072;&#1082; &#1096;&#1072;&#1073;&#1083;&#1086;&#1085; &#1086;&#1090;&#1095;&#1077;&#1090;&#1072;"-->
<!--                   onclick="add_new_report()"-->
        </p>
    </form>
    <div id="result_constructor" name="result_constructor" style="display:block"></div>
</div>
