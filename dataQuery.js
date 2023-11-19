function appendDatumList(containerId, filterFunction, labelFormatter) {
    var listId = "ul" + containerId;
    var $listContainer = $('<div id="target' + containerId + '" class="collapse" data-parent="#accordion"><ul id="' + listId + '" style="list-style:none;padding-left:0;"></ul>');
    $("#datum-select").append($listContainer);

    datumArray.filter(filterFunction).forEach(function (datum) {
        var datumLabel = labelFormatter(datum);
        $('#' + listId).append(
            '<li><input class="form-check-input datum-select" type="checkbox" value="' + datum + '">' +
            '<span class="form-check-sign"></span> ' + datumLabel + '</li>'
        );
    });
}

function datumOpt() {
    if (page_name == "data_quality") {
        $("#datum-select").append('<div class="card-header"><a data-toggle="collapse" href="#target1">Sensor Data<b class="caret"></b></a></div>');
        appendDatumList(1, isSensorDatum, function(datum) {
            return datum === "BluetoothDeviceProximity" ? "Bluetooth" : datum;
        });

        $("#datum-select").append('<div class="card-header"><a data-toggle="collapse" href="#target2">Protocol Data<b class="caret"></b></a></div>');
        appendDatumList(2, isProtocolDatum, function(datum) {
            var parts = datum.split('_');
            return parts[1] || datum;
        });
    }

    $("#datum-select").append('<div class="card-header"><a data-toggle="collapse" href="#target3">EMA Data<b class="caret"></b></a></div>');
    appendDatumList(3, isScriptDatum, function(datum) {
        var parts = datum.split('_');
        return parts[1] || datum;
    });

    $("#datum-select").on('click', '.datum-select', function () {
        $("#no-data").hide();
        var checkbox_datum = this.value.toLowerCase();
        var datum = JSON.parse(sessionStorage.getItem("datum")) || [];
        var index = datum.indexOf(checkbox_datum);
        if (index > -1) {
            $("#datum-btn button:contains(" + this.value + ")").remove();
            datum.splice(index, 1);
        } else {
            $("#datum-btn").append($('<button/>', {
                type: "button",
                class: "btn",
                text: this.value,
            }));
            datum.push(checkbox_datum);
        }
        sessionStorage.setItem("datum", JSON.stringify(datum));
        loadAndDraw();
    });
}
