export default log => {
    const formData = [];

    // fill formData
    JSON.parse(JSON.stringify(log)).map(a => {
        const index = formData.findIndex(b => a.hour == b.hour);
        if (index === -1) {
            formData.push([
                new Date(a.timestamp * 1000), // time
                log.filter(c => a.hour === c.hour).length // count
            ])
        }
    })

    // console.log('formData')
    // console.table(formData)

    return {
        grid: {},
        tooltip: {
            trigger: 'axis'
        },
        color: ['#087191'],
        xAxis: {
            type: 'category',
            name: 'Time',
            nameLocation: 'center',
            nameGap: 30,
            axisLabel: {
                showMaxLabel: true,
                showMinLabel: true
            },
            type: 'time',
            min: new Date() - (1000 * 60 * 60 * 25)
        },
        yAxis: {
            type: 'value',
            name: 'Requests',
            nameLocation: 'center',
            nameGap: 30,
            minInterval: 1
        },
        series: [{
            data: formData,
            type: 'line',
            smooth: true,
            animationEasing: 'quinticInOut',
        }]
    };
}