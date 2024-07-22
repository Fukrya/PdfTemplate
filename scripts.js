let originalContent;
let originalChartData;
let originalStackedBarData;
let myChart;
let myHorizontalStackedBarChart;

const initialData = [21, 16, 44, 19];
const originalData = {
    labels: ['192.168.99.10', '192.168.99.3', '192.168.99.139', '192.168.99.100', '192.168.99.99',
        '192.168.99.230', '192.168.99.138', '192.168.99.202', '192.168.99.106', '192.168.99.43'],
    datasets: [
        { label: 'CRITICAL', data: [0, 4, 3, 2, 0, 3, 3, 1, 2, 1], backgroundColor: '#981d32' },
        { label: 'HIGH', data: [13, 0, 0, 2, 1, 0, 0, 2, 3, 1], backgroundColor: '#e7424a' },
        { label: 'MEDIUM', data: [53, 17, 5, 4, 9, 4, 4, 6, 3, 5], backgroundColor: '#ea883d' },
        { label: 'LOW', data: [3, 5, 4, 4, 1, 4, 4, 1, 1, 0], backgroundColor: '#f3c146' }
    ]
};

function toggleEditMode() {
    const isEditable = document.querySelector('.editable') !== null;

    document.querySelectorAll('#content *').forEach(element => {
        element.contentEditable = !isEditable;
        element.classList.toggle('editable', !isEditable);
    });

    document.getElementById('chartInputs').classList.toggle('hidden', isEditable);
    document.getElementById('chartDataContainer').classList.toggle('hidden', isEditable);

    if (!isEditable) {
        createChartInputs();
        createPieChartInputs();
        originalContent = document.getElementById('content').innerHTML;
        originalChartData = [...myChart.data.datasets[0].data];
        originalStackedBarData = JSON.parse(JSON.stringify(myHorizontalStackedBarChart.data));
    }

    document.getElementById('editButton').classList.toggle('hidden', !isEditable);
    document.getElementById('saveButton').classList.toggle('hidden', isEditable);
    document.getElementById('cancelButton').classList.toggle('hidden', isEditable);
}


function createChartInputs() {
    const chartInputs = document.getElementById('chartInputs');
    chartInputs.innerHTML = ''; // Clear any existing inputs

    myHorizontalStackedBarChart.data.datasets.forEach((dataset, datasetIndex) => {
        const datasetDiv = document.createElement('div');
        datasetDiv.className = 'dataset-input-group';

        const datasetLabel = document.createElement('h3');
        datasetLabel.textContent = dataset.label || `Dataset ${datasetIndex + 1}`;
        datasetDiv.appendChild(datasetLabel);

        dataset.data.forEach((dataPoint, dataIndex) => {
            const dataDiv = document.createElement('div');
            dataDiv.className = 'data-input-group';

            const label = document.createElement('label');
            label.textContent = `Data ${dataIndex + 1}`;
            dataDiv.appendChild(label);

            const input = document.createElement('input');
            input.type = 'number';
            input.value = dataPoint;
            input.className = 'chart-data-input';
            input.dataset.datasetIndex = datasetIndex;
            input.dataset.dataIndex = dataIndex;
            dataDiv.appendChild(input);

            datasetDiv.appendChild(dataDiv);
        });

        chartInputs.appendChild(datasetDiv);
    });
}

function createPieChartInputs() {
    const chartDataContainer = document.getElementById('chartDataContainer');
    chartDataContainer.innerHTML = ''; // Clear any existing inputs

    myChart.data.datasets[0].data.forEach((dataPoint, index) => {
        const dataDiv = document.createElement('div');
        dataDiv.className = 'data-input-group';

        const label = document.createElement('label');
        label.textContent = myChart.data.labels[index]; // Use the label from the chart data
        dataDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = dataPoint;
        input.className = 'chart-data-input';
        input.dataset.dataIndex = index;
        dataDiv.appendChild(input);

        chartDataContainer.appendChild(dataDiv);
    });
}

function saveChanges() {
    // Update the pie chart data
    const pieChartInputs = document.querySelectorAll('#chartDataContainer .chart-data-input');
    pieChartInputs.forEach(input => {
        const dataIndex = input.dataset.dataIndex;
        myChart.data.datasets[0].data[dataIndex] = parseInt(input.value);
    });
    myChart.update();

    // Update the horizontal stacked bar chart data
    const stackedBarChartInputs = document.querySelectorAll('#chartInputs .chart-data-input');
    stackedBarChartInputs.forEach(input => {
        const datasetIndex = input.dataset.datasetIndex;
        const dataIndex = input.dataset.dataIndex;
        myHorizontalStackedBarChart.data.datasets[datasetIndex].data[dataIndex] = parseInt(input.value);
    });
    myHorizontalStackedBarChart.update();

    toggleEditMode(); // Exit edit mode
}

function cancelEdit() {
    document.getElementById('content').innerHTML = originalContent;
    myHorizontalStackedBarChart.data = JSON.parse(JSON.stringify(originalStackedBarData));
    myHorizontalStackedBarChart.update();
    updatePieChart(true);
    toggleEditMode();
}

function updatePieChart(isRestoring = false) {
    if (isRestoring) {
        myChart.data.datasets[0].data = [...originalChartData];
    } else {
        const newData = Array.from(document.querySelectorAll('.chart-data-input')).map(input => parseInt(input.value));
        myChart.data.datasets[0].data = newData;
    }
    myChart.update();
}

document.addEventListener('DOMContentLoaded', () => {
    const ctx1 = document.getElementById('myHorizontalStackedBarChart').getContext('2d');
    myHorizontalStackedBarChart = new Chart(ctx1, {
        type: 'bar',
        data: originalData,
        options: {
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });

    const ctx2 = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
            datasets: [{
                backgroundColor: ["#981d32", "#e7424a", "#ea883d", "#f3c146"],
                data: initialData
            }]
        }
    });
});
