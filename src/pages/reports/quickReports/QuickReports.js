import FreeIssues from './freeissues/FreeIssues'
import MarcketReturnReportExcell from './marketreturns/MarcketReturnReportExcell'
import DistributorStockReport from './distributorstock/DistributorStockReport'
import DayilyReport from './daily/DayilyReport'
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import IteneryReport from './itenery/IteneryReport';
import DPerformanceReport from './distributor_performance/DPerformanceReport';
import ProductivityReport from './productivity/ProductivityReport';
import RetailerPerformanceReport from './retailer_performance/RetailerPerformanceReport';
import RdPerformanceReport from './rd_performance/RdPerformance';
import MonthItenery from './monthlyItenery/MonthItenery';

const QuickReports = (props) => {
    const [distributors, setDistributors] = useState([]);
    const [salesrefs, setSalesrefs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [psas, setPsas] = useState([])
    useEffect(() => {
        if (props.user.is_manager) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/by/manager/${props.user.id}`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setDistributors(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });


        }
        if (props.user.is_company) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setDistributors(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });


        }
        if (props.user.is_excecutive) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/by/executive/${props.user.id}`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setSalesrefs(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (props.user.is_distributor) {
            axiosInstance.get(`/distributor/salesrefs/${props.user_details.id}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
                .then((res) => {
                    setSalesrefs(res.data);
                }).catch((err) => {
                    console.log(err);
                });
        }

        axiosInstance
            .get(`/psa/all/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setPsas(res.data);
            })
            .catch((err) => {
                console.log(err);
            })

    }, ['']);
    return (
        <div className="page">
            <DPerformanceReport user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <RdPerformanceReport user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <RetailerPerformanceReport user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <MonthItenery psas={psas} user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <IteneryReport psas={psas} user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <ProductivityReport user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <DistributorStockReport user={props.user} user_details={props.user_details} />
            <FreeIssues user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <MarcketReturnReportExcell user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />
            <DayilyReport user={props.user} user_details={props.user_details} salesrefs={salesrefs} distributors={distributors} />

        </div>
    )
}

export default QuickReports