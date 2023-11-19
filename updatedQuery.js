function populateQueryTool() {
    if (!timeline || timeline.length === 0) {
        $("#query-loader").fadeOut(400);
        $('#query-tool').hide();
        return;
    }

    $('input[name="pidfilter"]').on('input', pidsFilterChange);
    pidsFilterChange();

    const $pids = $("#pids");
    participants.forEach(pid => $pids.append($("<option>", { id: pid, text: pid })));

    const $dateRange = $('input[name="daterange"]');
    if ($dateRange.length > 0) {
        const [startDate, endDate] = [dates[0], dates[dates.length - 1]];
        const initDate = dates[dates.length - 35];

        $dateRange.daterangepicker({
            opens: 'left',
            startDate: initDate,
            endDate: endDate,
            minDate: startDate,
            maxDate: endDate,
            locale: { format: 'YYYY-MM-DD', cancelLabel: 'Clear' }
        }).on('cancel.daterangepicker', function(ev, picker) {
            picker.setStartDate(startDate);
            picker.setEndDate(endDate);
        });
    }
}

function filterButton(event) {
    event.preventDefault();
    pidsUpdate();
    daterangeUpdate();
    updateGridData();
}

function pidsFilterChange(updateGrid = true) {
    if (!timeline) return;

    let filteredPids = new Set(timeline.map(value => pidFmt(value[0])));
    const pidfilter = $('input[name="pidfilter"]').val().trim().toLowerCase();

    if (pidfilter) {
        const exclude = pidfilter.startsWith("!");
        const filterValue = exclude ? pidfilter.slice(1) : pidfilter;
        filteredPids = [...filteredPids].filter(pid => exclude ^ pid.toLowerCase().includes(filterValue));
    }

    const $pids = $("#pids").empty();
    filteredPids.forEach(pid => $pids.append($("<option>", { id: pid, text: pid })));

    if (updateGrid) {
        // Add logic to update the grid if necessary
    }
}

function pidsUpdate() {
    const selectedPids = $("#pids").val() || [];
    participants = selectedPids.length > 0 ? selectedPids : $("#pids option").map((_, opt) => $(opt).val()).get();
}

function daterangeUpdate() {
    const $dateRange = $('input[name="daterange"]');
    if ($dateRange.length > 0) {
        const range = $dateRange.data('daterangepicker');
        const [min_date, max_date] = [range.startDate._i, range.endDate._i];

        dates = dates.filter(date => min_date <= date && date <= max_date);
    }
}

function complianceShading() {
    const rect = d3.select('#grid').selectAll('rect');
    const checked = $("#compliance-checkbox").prop("checked");
    const scale = d3.scale.linear().domain([0, 1]).range([0.3, 1]);

    rect.transition().ease("easeExp").duration(200)
        .style("opacity", d => checked && !isNaN(d.compliance) ? scale(d.compliance) : 1);
}

function multiselectType() {
    const conj = $("#multiselect-checkbox").prop("checked") ? "AND" : "OR";
    loadAndDraw(conj); // Assuming loadAndDraw can accept this parameter
}
