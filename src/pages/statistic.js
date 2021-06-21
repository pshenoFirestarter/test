import React, {useEffect, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import {connect} from 'react-redux'
import {useMessage} from "../hooks/msg.hook";
import {useHttp} from "../hooks/http.hook";
import {getList, preloader} from "../redux/actions";
import DatePicker from "react-date-picker";
import MultiSelect from '../components/multiselect';
import LineChart from '../components/Statistics/lineChart'
import Table from "../components/Statistics/Table"



const Statistic = ({preloader, myList}) => {
    const [idState, setId] = useState(null)
    const [chart, setChart] = useState(null);
    const [data, setData] = useState(null)
    const [tables, setTable] = useState(null)
    const [keyButton, setKeyButton] = useState(null)
    const [legend, setLegend] = useState(null)
    const [startD, setStartD] = useState('');
    const [endD, setEndD] = useState('');
    const [sources, setSources] = useState([]);
    const [src, setSrc] = useState(null)
    const [campaign, setCampaign] = useState([])
    const [totals, setTotals] = useState(null)
    const [sort, setSort] = useState(1);
    const [csv, setCsv] = useState({head: '', body: ''})

    const message = useMessage();
    const history = useHistory();
    const {err, req, clear} = useHttp(preloader);


    const checkLine = (event, name) => {
        event.persist();

        setKeyButton(keyButton.map(el => {
            if (el.name === event.target.name) {
                if (el.bool) {
                    return {
                        ...el,
                        bool: false
                    }
                } else {
                    return {
                        ...el,
                        bool: true
                    }
                }
            }
            return el
        }))


        let newChart = [];
        chart.forEach((el, index) => {
            if (event.target.value === 'true') {
                Object.keys(el).forEach(elem => {
                    if (elem === name) {
                        delete el[name]
                        newChart.push(el)
                    }
                })
            } else {
                el[name] = tables[index][name]
                newChart.push(el)
            }
        })

        setChart(newChart)
    }
    const pageName = async () => {
        try {
            const data = await req(process.env.REACT_APP_API + 'api/ustats?pageSize=10000', 'GET',);
            if (data.data.length > 0) {
                setId(data)

                let arr = [];

                data.data.forEach(el => {
                    if (el.campaignId) {
                        if (arr.length === 0) {
                            arr.push({
                                id: el.campaignId,
                                name: el.name,
                            })

                            return
                        }
                        if (arr.some(elem => elem.id === el.campaignId)) {
                            return
                        }

                        arr.push({
                            id: el.campaignId,
                            name: el.name,
                            stats: el.stats,
                        })
                    }
                })

                let date = [];

                data.data.forEach(el => {
                    date.push(new Date(el.date))
                })

                date.sort(function(a, b) {
                    return a - b;
                });



                setSources(arr)
                setSrc(data.data[0].campaignId)

                let start = new Date(date[0] - 86400000),
                    end = new Date(date[date.length-1].setMinutes(new Date().getMinutes() + 1440));


                submit(start, end, arr[0].id)
            }

        } catch (e) {
            console.log(e)
            message('server error')
        }
    };
    const sourceHandler = (val) => {
        setSrc(val)
    }
    const dateConvert = (val) => {
        let date = val.getFullYear() + "-" + (`${(val.getMonth() + 1)}`.length > 1
            ? (val.getMonth() + 1)
            : ('0' + (val.getMonth() + 1))) + "-" + (`${(val.getDate())}`.length > 1
            ? val.getDate()
            : ('0' + (val.getDate())))

        return date
    }

    const submit = async (start = false, end = null, id = null) => {
        try {
            let post = {},
                table = {},
                newChart= [],
                newTable = [],
                csvArr = [];


            if (start) {
                post = await req(process.env.REACT_APP_API + 'api' + `/ustats?page=1&pageSize=10000&` + `campaignId=${id}&startDate=${new Date(start.setMinutes(new Date().getMinutes() + 1440)).toISOString().split('T')[0]}&endDate=${new Date(end.setMinutes(new Date().getMinutes() + 1440)).toISOString().split('T')[0]}`, 'GET');

                setStartD(new Date(start - 86400000))
                setEndD(new Date(end - 86400000))
            } else {
                post = await req(process.env.REACT_APP_API + 'api' + `/ustats?page=1&pageSize=10000&` + `campaignId=${src ? src : ''}&startDate=${dateConvert(startD)}&endDate=${dateConvert(endD)}`, 'GET');
            }



            if (!post.data.length) {
                message('Данных нет')
                setChart(null)
                setTable(null)
                setTotals(null)
                return
            }

            let total = {
                firstQuartile: 0,
                secondQuartile: 0,
                thirdQuartile: 0,
                completeView: 0,
                impressions: 0,
                budget: 0,
                clicks: 0,
                totalReach: 0,
            }

            post.data.map(el => {
                el.stats.cpc = el.stats.clicks === 0 ? 0 : el.stats.budget / el.stats.clicks === Infinity ? 0 : el.stats.budget / el.stats.clicks;
                el.stats.ctr = isNaN(100*el.stats['clicks']/el.stats['impressions']) || 100*el.stats['clicks']/el.stats['impressions'] === Infinity ? 0 : Number((100*el.stats['clicks']/el.stats['impressions']).toFixed(2))
                el.stats.cpm = isNaN(el.stats['budget']/el.stats['impressions']*1000) || el.stats['budget']/el.stats['impressions']*1000 === Infinity ? 0 : Number((el.stats['budget']/el.stats['impressions']*1000).toFixed(5));
                el.stats.cpt = el.stats.budget == 0 ? 0 : (Number(el.stats.budget) / Number(el.stats.reach) * 1000).toFixed(2);
                el.stats.frequency = el.stats.reach == 0 ? 0 : Number(el.stats.impressions) / Number(el.stats.reach);
                el.stats.date = el.stats.date.length > 1 ? el.stats.date.replace('T00:00:00Z', '') : el.stats.date

                return el
            })

            post.data.forEach(el => {
                total.firstQuartile += el.stats.firstQuartile;
                total.secondQuartile += el.stats.secondQuartile;
                total.thirdQuartile += el.stats.thirdQuartile;
                total.completeView += el.stats.completeView;
                total.impressions += el.stats.impressions;
                total.budget += el.stats.budget;
                total.clicks += el.stats.clicks;
                total.totalReach += el.stats.reach;
            })

            total.cpc = total.clicks == 0 ? 0 : Number(total.budget) / Number(total.clicks) === Infinity ? 0 : Number(total.budget) / Number(total.clicks);
            total.ctr = isNaN(100*total['clicks']/total['impressions']) || 100*total['clicks']/total['impressions'] === Infinity ? 0 : Number((100*total['clicks']/total['impressions']).toFixed(2))
            total.cpm = isNaN(total['budget']/total['impressions']*1000) || total['budget']/total['impressions']*1000 === Infinity ? 0 : Number((total['budget']/total['impressions']*1000).toFixed(5));

            total.cpc = Number(total.cpc.toFixed(2))
            total.cpm = Number(total.cpm.toFixed(2))
            total.budget = Number(total.budget.toFixed(2))

            let newtotal = {
                ctr: total.ctr,
                cpt: total.cpt,
                cpm: total.cpm,
                cpc: total.cpc,
            }

            newtotal["Показы"] = total.impressions
            newtotal['Бюджет'] = total.budget
            newtotal["Клики"] = total.clicks
            newtotal["Охват"] = total.reach
            newtotal["Частота"] = total.frequency
            newtotal["Просмотры"] = total.completeView
            newtotal["25%"] = total.firstQuartile
            newtotal["50%"] = total.secondQuartile
            newtotal["75%"] = total.thirdQuartile
            newtotal['Суммарный охват'] = total.totalReach



            setTotals(newtotal)
            setData(post)

            let keyChart = Object.keys(post.data[0].stats).map(el => {
                if (el === "budget") {return 'Бюджет'}
                if (el === "impressions") {return 'Показы'}
                if (el === "clicks") {return 'Клики'}
                if (el === "reach") {return 'Охват'}
                if (el === "frequency") {return 'Частота'}
                if (el === "firstQuartile") {return '25%'}
                if (el === "secondQuartile") {return '50%'}
                if (el === "thirdQuartile") {return '75%'}
                if (el === "completeView") {return 'Просмотры'}
                if (el !== "date" && el !== "totalReach") {return el}
            })

             let csvSum = {
                date: '',
                completeView: 0,
                impressions: 0,
                budget: 0,
                clicks: 0,
                reach: 0,
                ctr: 0,
                cpt: 0,
                cpm: 0,
                cpc: 0,
                frequency: 0,
                firstQuartile: 0,
                secondQuartile: 0,
                thirdQuartile: 0,
            };

            if (post.data.length > 0) {
                post.data.forEach(el => {
                    let {
                        date: date,
                        completeView: completeView,
                        impressions: impressions,
                        budget: budget,
                        clicks: clicks,
                        reach: reach,
                        ctr: ctr,
                        cpt: cpt,
                        cpm: cpm,
                        cpc: cpc,
                        frequency : frequency,
                        firstQuartile: firstQuartile,
                        secondQuartile: secondQuartile,
                        thirdQuartile: thirdQuartile,
                    } = el.stats

                    csvArr.push({
                        date: date,
                        completeView: completeView,
                        impressions: impressions,
                        budget: budget,
                        clicks: clicks,
                        reach: reach,
                        ctr: ctr + ' %',
                        cpt: cpt,
                        cpm: cpm,
                        cpc: Number(cpc).toFixed(2) + ' rub',
                        frequency : Number(frequency).toFixed(2),
                        firstQuartile: firstQuartile,
                        secondQuartile: secondQuartile,
                        thirdQuartile: thirdQuartile,
                    })

                     try {
                         csvSum.completeView += Number(completeView)
                         csvSum.impressions += Number(impressions)
                         csvSum.budget += Number(budget)
                         csvSum.clicks += Number(clicks)
                         csvSum.reach += Number(reach)
                         // csvSum.ctr += Number(ctr)
                         // csvSum.cpt += Number(cpt)
                         // csvSum.cpm += Number(cpm)
                         // csvSum.cpc += Number(Number(cpc).toFixed(2))
                         // csvSum.frequency += Number(Number(frequency).toFixed(2))
                         csvSum.firstQuartile += Number(firstQuartile)
                         csvSum.secondQuartile += Number(secondQuartile)
                         csvSum.thirdQuartile += Number(thirdQuartile)

                     } catch (e) {
                         console.log(e)
                     }
                })

                csvSum.ctr = csvSum.clicks / csvSum.impressions * 100
                csvSum.cpm = csvSum.budget / csvSum.impressions * 1000
                csvSum.frequency = csvSum.impressions / csvSum.reach
                csvSum.cpc = csvSum.budget / csvSum.clicks
                csvSum.cpt = csvSum.budget / csvSum.reach * 1000

                // console.log(csvSum)

                setCsv({
                    head: Object.keys(csvArr[0]).map(el => el + ';').join(''),
                    body: csvArr.map(el => Object.keys(el).map(elem => String(el[elem]).replace('.', ',') + ';').join('')).join('\n'),
                    final: Object.keys(csvSum).map((el, i) => String(csvSum[el]).replace('.', ',') + ';').join(''),
                })

                post.data.forEach(el => {
                    newChart.push({
                        "Просмотры": Number(el.stats.completeView).toFixed(2),
                        "Показы": Number(el.stats.impressions).toFixed(2),
                        "Бюджет": Number(el.stats.budget).toFixed(2),
                        "Клики": Number(el.stats.clicks).toFixed(2),
                        "Охват": Number(el.stats.reach).toFixed(2),
                        ctr: Number(el.stats.ctr).toFixed(2),
                        cpt: Number(el.stats.cpt).toFixed(2),
                        cpm: Number(el.stats.cpm).toFixed(2),
                        cpc: Number(el.stats.cpc).toFixed(2),
                        "Частота": Number(el.stats.frequency).toFixed(2),
                        "25%": Number(el.stats.firstQuartile).toFixed(2),
                        "50%": Number(el.stats.secondQuartile).toFixed(2),
                        "75%": Number(el.stats.thirdQuartile).toFixed(2),
                    })
                })



                post.data.forEach(el => {

                    let {
                        date: date,
                        completeView: completeView,
                        impressions: impressions,
                        budget: budget,
                        clicks: clicks,
                        reach: reach,
                        ctr: ctr,
                        cpt: cpt,
                        cpm: cpm,
                        cpc: cpc,
                        frequency : frequency,
                        firstQuartile: firstQuartile,
                        secondQuartile: secondQuartile,
                        thirdQuartile: thirdQuartile,
                    } = el.stats



                    newTable.push({
                        date: date,
                        dateParse: Date.parse(new Date(date)),
                        "Показы": impressions,
                        'Бюджет': budget ? Number(budget.toFixed(2)) : 0,
                        "Клики": clicks,
                        "Охват": reach,
                        ctr: ctr,
                        cpt: cpt,
                        cpm: cpm ? Number(cpm.toFixed(2)) : 0,
                        "Частота": frequency.toFixed(5),
                        "25%": firstQuartile,
                        "50%": secondQuartile,
                        "75%": thirdQuartile,
                        "Просмотры": completeView,
                        cpc: cpc ? Number(cpc.toFixed(2)) : 0,
                        cpv: ((budget ? Number(budget.toFixed(2)) : 0) / Number(completeView)).toFixed(2)
                    })
                })



                setTable(newTable)
                setChart(newChart)
                setLegend(keyChart)

                setKeyButton(keyChart.map(el => {
                    return {value: el, name: el, bool: true}
                }))
            } else {
                setLegend(null)
                setChart(null)
                setTable(null)
                setKeyButton(null)
            }

        } catch (e) {
            console.log(e)
            message('server error')
        }

    }

    const sortRow = (name) => {

        let full = tables.sort((a, b) => {
            if (a[name] > b[name]) {
                return sort;
            }
            if (a[name] < b[name]) {
                return -sort;
            }

            return 0
        })

        setTable(full)
        setSort(-sort)
    }

    const saveAs = (text, filename) => {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=urf-8,'+encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
    }


    useEffect(() => {
        if (!idState) {
            pageName()
        }
        message(err);
        clear()
    }, [err, message, clear,]);


    return (
        <div className={'page statistics-page'}>
            {/*HEADER*/}
            <div className="head">
                <h1>Статистика</h1>
            </div>
            {/*HEADER END*/}

            {/*CONTENT*/}
            <div className={'z-depth-3 static-content'}>
                <div className={'static-info'}>
                    <div className="field">
                        <b>ID: </b>
                        <span>{data ? data.data[0].campaignId ? '-' : data.data[0].campaignId : '-'}</span>
                    </div>
                    <div className="field">
                        <b>название: </b>
                        <span>{data ? data.data[0].name : '-'}</span>
                    </div>
                    <div className="field">
                        <b>Формат: </b>
                        <span>Campaign</span>
                    </div>

                    <div className="static-summ">
                        <h5>Суммарная статистика</h5>
                        <ul>
                            {totals ? Object.keys(totals).map((el, index) =>
                                el === 'Охват' || el === 'cpt' || el === 'Частота'
                                ? null
                                : <li key={index}>
                                        <b>{el === 'ctr'
                                            ? 'ctr %'
                                            : el}
                                            :</b>{el === 'cpt'
                                    ? totals[el] * 1000
                                    : Number(totals[el].toFixed(5))}
                                    </li>)
                                : <li>Пусто..</li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="static-chart">
                    <div className="post-panel">
                        <div className={'static-dater'}>
                            <div>
                                <h6>Дата начала</h6>
                                <DatePicker
                                    name={'myDate'}
                                    format={'dd-MM-y'}
                                    className="datePicker"
                                    onChange={setStartD}
                                    value={startD}
                                />
                            </div>

                            <div>
                                <h6>Дата окончания</h6>
                                <DatePicker
                                    name={'myDates'}
                                    format={'dd-MM-y'}
                                    className="datePicker"
                                    onChange={setEndD}
                                    value={endD}
                                />
                            </div>
                        </div>

                        {sources
                        ? <MultiSelect
                                sources={sources}
                                src={setSrc}
                                sourceHandler={sourceHandler} />
                        : null}

                        <button
                            onClick={() => submit(false)}
                            type={'button'}
                            disabled={!startD || !endD}
                            className={'waves-effect waves-light btn-small btn black'}>
                            LOAD...
                        </button>

                        <button
                            type={'button'}
                            disabled={!tables}
                            className={'waves-effect waves-light btn-small btn black'}
                            onClick={() => saveAs(csv.head + "\n" + csv.body + "\n\n" + csv.final, 'data.csv')}>save CSV</button>

                    </div>
                    <div className="control-panel">
                        {keyButton ? keyButton.map((el, index) =>
                            !!el.name
                                ? <label key={index}>
                                    <input
                                        name={el.name}
                                        type="checkbox"
                                        className="filled-in"
                                        onChange={event => checkLine(event, el.value)}
                                        value={el.bool}
                                        checked={el.bool} />
                                    <span>{el.name}</span>
                                </label>
                                : null
                        ) : 'Data empty ....'}
                    </div>
                    <div className={'chart-wrapper'}>
                        {chart && data ? <LineChart data={chart} stats={legend ? legend : []}/> : 'Data empty ....'}
                    </div>
                </div>
            </div>
            {/*CONTENT END*/}

            {/*TABLE*/}
            <div className="static-table z-depth-3">
                {tables ? <Table data={tables} sortRow={sortRow} /> : 'Data empty ....'}
            </div>
            {/*TABLE END*/}
        </div>
    )
};

const mapStateToProps = state => {
    return {
        myList: state.store.myList,
    }
};

const mapDispatchToProps = {
    preloader,
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);