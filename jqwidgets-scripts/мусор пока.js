'use strict';

// Для преобразование инмпутов модели в объект
function objectifyForm(formArray) {//serialize data function
    let data = new FormData();
    for (let i = 0; i < formArray.length; i++) {
        data.append(formArray[i]['name'], formArray[i]['value']);
    }
    return data;
}

// Для коректной обработки статуса сервера
function checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
        return res
    } else {
        let err = new Error(res.statusText);
        err.response = res;
        console.error('Ошибка в адресе сервера', res);
        throw err
    }
}


class GridRestructurizazia {

    constructor() {
        let self = this;
        this.$grid = $('#grid');

        this.$grid.jqxGrid(self.nastroiki_grida);


        this.okno_redaktirovania = new OknoRedaktirovaniaRestructurizazia;

        this.$grid.on('rowdoubleclick', function (event) {
            let args = event.args;
            let id = (args.row.bounddata.id);
            let adres = (args.row.bounddata.adres);
            self.okno_redaktirovania.open_redaktirovanie(id, adres);
        });

    }

    get nastroiki_grida() {
        let self = this;
        return {
            width: '100%',
            height: '100%',
            source: this.data_adapter,
            columns: this.colums,
            enabletooltips: true,
            localization: RUS_LOCALIZ,
            filterable: true,
            showtoolbar: true,
            pageable: true,
            columnsresize: true,
            autorowheight: true,
            scrollmode: 'logical',
            rowsheight: 40,
            toolbarheight: 40,
            theme: 'light',
            altrows: true,
            sortable: true,
            showstatusbar: true,
            statusbarheight: 25,
            pagesizeoptions: ['5', '10', '30', '50', '100'],
            pagesize: 10,
            rendertoolbar: function (statusbar) {
                self.render_custom_toolbar(statusbar);
            }
        }
    }

    get fields() {
        return [
            {name: 'id', type: 'number'},

            {name: 'data_zaivlenia', type: 'date'},
            {name: 'ls', type: 'string'},
            {name: 'fio', type: 'string'},
            {name: 'razmer_restruc', type: 'number'},
            {name: 'telephone', type: 'string'},
            {name: 'primechanie', type: 'string'},

            {name: 'pometka_na_udalenie', type: 'bool'},
            {name: 'data_izmenenia', type: 'date'},
        ]
    }

    get colums() {
        return [
            {
                text: '№',
                datafield: 'id',
                align: 'center',
                cellsalign: 'center',
                width: '50'
            },

            {
                text: 'Дата заявления',
                datafield: 'data_zaivlenia',
                align: 'center',
                cellsalign: 'center',
                width: '200',
                filtertype: 'date',
                cellsformat: 'dd.MM.yyyy',

            },

            {
                text: 'ЛС',
                datafield: 'ls',
                align: 'center',
                cellsalign: 'center',
                width: '200',
                filtertype: 'input'
            },

            {
                text: 'ФИО',
                datafield: 'fio',
                align: 'center',
                cellsalign: 'center',
                width: '200',
                filtertype: 'input'
            },

            {
                text: 'Размер реструктуризации',
                datafield: 'razmer_restruc',
                align: 'center',
                cellsalign: 'center',
                cellsformat: 'd2',
                width: '200',
                filtertype: 'number'
            },

            {
                text: 'Телефон',
                datafield: 'telephone',
                align: 'center',
                cellsalign: 'center',
                filtertype: 'input',
                width: '200'
            },

            {
                text: 'Примечание',
                datafield: 'primechanie',
                align: 'center',
                cellsalign: 'center',
                width: '300',
                filtertype: 'input'
            },

            {
                text: 'Пометка на удаление',
                datafield: 'pometka_na_udalenie',
                align: 'center',
                cellsalign: 'center',
                width: '100',
                filtertype: 'bool',
                columntype: 'checkbox'
            },
            {
                text: 'Дата изменения',
                datafield: 'data_izmenenia',
                align: 'center',
                cellsalign: 'center',
                cellsformat: 'dd.MM.yyyy',
                filtertype: 'date',
                width: '200'
            },
        ];
    }

    get data_adapter() {

        return new $.jqx.dataAdapter({
            datatype: "json",
            data: 'data',
            url: URL_API_RESTRUCTURIZAZIA,
            datafields: this.fields,
            sortcolumn: 'id',
            sortdirection: 'desc'
        });
    }

    refresh_grid() {
        this.$grid.jqxGrid({source: this.data_adapter});
    }


    render_custom_toolbar(statusbar) {
        let self = this;

        let container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");

        if (get_curent_grup() === 'admin' || get_curent_grup() === 'ordz') {
            let addButton = $("<div style='float: left; margin-left: 15px; '><span ><i class='fa fa-plus-circle' aria-hidden='true'></i> Добавить</span></div>");
            container.append(addButton);
            addButton.jqxButton({width: 90, height: 18});
            addButton.click(function (event) {
                self.okno_redaktirovania.open_dovbavlenia();
            });
        }


        let refreshButton = $("<div style='float: left; margin-left: 15px; '><span ><i class='fa fa-refresh' aria-hidden='true'></i> Обновить</span></div>");
        container.append(refreshButton);
        refreshButton.jqxButton({width: 90, height: 18});
        refreshButton.click(function (event) {
            self.refresh_grid();
        });

        statusbar.append(container);


    }


}

class OknoRedaktirovaniaRestructurizazia {

    constructor() {
        let self = this;
        this.$modal_redaktirovania = $('#modal_redaktirovania');
        this.$forma_redaktirovania = this.$modal_redaktirovania.find('#form_redaktirovania');
        this.$tab_istoria = this.$modal_redaktirovania.find('#v_pills_tab_istoria');
        this.$tablia_istoria_izmenenia = this.$modal_redaktirovania.find('#tablia_istoria_izmenenia');
        this.$modal_title = this.$modal_redaktirovania.find('.modal-title');

        this.$forma_redaktirovania.submit(function (e) {
            e.preventDefault();
            let id = self.$forma_redaktirovania.data('id');
            let URL = `${URL_API_RESTRUCTURIZAZIA}${id}`;
            let data = self.$forma_redaktirovania.serializeArray();
            data = objectifyForm(data);
            fetch(URL, {
                method: 'POST',
                body: data,
                credentials: 'include'
            })
                .then(checkStatus)
                .then(data => {
                    self.$modal_redaktirovania.modal('hide');
                    //refresh_grid();
                    new PNotify({
                        title: 'Успех',
                        type: 'success'
                    });
                })
                .catch(err => {
                    console.error('Ошибка:');
                    new PNotify({
                        title: 'Ошибка',
                        type: 'error'
                    });
                });
        })
    }

    // открывает модальное окно в режиме редактирования выбранной записи
    open_redaktirovanie(id) {
        let self = this;
        this.$forma_redaktirovania.trigger('reset');
        this.$tab_istoria.show();
        this.$forma_redaktirovania.data('id', '/' + id);
        this.$modal_title.text(`Редактирование записи ${id}`);
        this.$modal_redaktirovania.modal({show: true, backdrop: false});

        fetch(`${URL_API_RESTRUCTURIZAZIA}/${id}`, {
            method: 'get',
            // body: data,
            credentials: 'include'
        })
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                let content = data['data'];
                let istoria_izmenenia = data['istoria_izmenenia'];
                for (let key in content) {
                    if (content.hasOwnProperty(key)) {
                        $('input[name=' + key + ']').val(content[key]);
                        $('textarea[name=' + key + ']').val(content[key]);
                        $('select#id_' + key).val(content[key]);
                    }
                }
                for (let key in istoria_izmenenia) {
                    let date_string = Date.parse(istoria_izmenenia[key]['data_redaktirovania']);
                    date_string = new Date(date_string);
                    self.$tablia_istoria_izmenenia.append(`
                        <tr>
                            <td>${istoria_izmenenia[key]['stolbez']}</td>
                            <td>${istoria_izmenenia[key]['staroe_znachenie']}</td>
                            <td>${istoria_izmenenia[key]['novoe_znachenie']}</td>
                            <td>${istoria_izmenenia[key]['user']}</td>
                            <td>${date_string}</td>
                        </tr>
                    `);
                }
            });
    }

    // открывает модальное окно в режиме добавления новой записи
    open_dovbavlenia() {
        this.$forma_redaktirovania.trigger('reset');
        this.$tab_istoria.hide();
        this.$modal_title.text('Добавить');
        this.$forma_redaktirovania.data('id', '');
        this.$forma_redaktirovania.trigger('reset');
        this.$modal_redaktirovania.modal({show: true, backdrop: false});
    }
}


$(document).ready(function () {
    new GridRestructurizazia();

});