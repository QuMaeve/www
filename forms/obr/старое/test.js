$(function(){
    $('#l_city').change(function(){
        var val = $(this).val(); //�������� option
        $.ajax({
            type:'post',
            url:'test3.php',//���������� php
            data:'city_zab='+val,//�������� �������� option. �� ������� ����� �������� $_POST['value'}
            success:function(result){// �������� ����� � �������
                $('#res').html(result);//������� �� ��������
            }

        })
        console.log($(this).val());
    })
})