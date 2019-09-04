import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Button, Checkbox, Accordion, Form, Segment, Grid } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortedOrder: "desc",
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.jobsFilter = this.jobsFilter.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({

            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortedOrder,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                this.setState({
                    loadJobs: res.myJobs,
                    totalPages: Math.ceil(res.totalCount / 6)
                }, callback);
            }.bind(this),
            error: function (res) {
                alert('Error: ' + res.error);
                callback();
            }
        });

    }

    jobsFilter(e, { checked, name }) {
        this.state.filter[name] = checked;
        this.setState({ filter: this.state.filter });
    }

    handlePaginationChange(e, { activePage }) {
        this.loadNewData({ activePage: activePage })
    }

    handleOrderChange(e, { value }) {
        this.state.sortedOrder = value;
        this.loadNewData({ sortedOrder: this.state.sortedOrder })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        const orderOptions = [
            {
                key: 'desc',
                text: 'Newest first',
                value: 'desc',
                content: 'Newest first',
            },
            {
                key: 'asc',
                text: 'Oldest first',
                value: 'asc',
                content: 'Oldest first',
            }
        ];
        let jobData = this.state.loadJobs;
        let jobList = null;
        if (jobData.length > 0) {
            jobList = jobData.map(job => {
                return (
                    <JobSummaryCard key={job.id} data={job} reloadData={this.loadData} />);
            })
        }
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div className="ui grid">
                        <div className="row">
                            <div className="column">
                                <span>
                                    <Icon name='filter' />
                                    {"Filter: "}
                                    <Dropdown inline simple text="Choose Filter">
                                        <Dropdown.Menu>
                                            <Dropdown.Item >
                                                <Form>
                                                    <Form.Group grouped>
                                                        <h4><b>Job Status</b></h4>
                                                        <Form.Checkbox label={'Active Jobs'}
                                                            name="showActive" onChange={this.jobsFilter} checked={this.state.filter.showActive} />
                                                        <Form.Checkbox label={'Closed Jobs'}
                                                            name="showClosed" onChange={this.jobsFilter} checked={this.state.filter.showClosed} />
                                                        <Form.Checkbox label={'Draft'}
                                                            name="showDraft" onChange={this.jobsFilter} checked={this.state.filter.showDraft} />
                                                    </Form.Group>
                                                </Form>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item>
                                                <Form>
                                                    <Form.Group grouped>
                                                        <h4><b>Job Expiry Date</b></h4>
                                                        <Form.Checkbox label={'Expired Jobs'}
                                                            name="showExpired" onChange={this.jobsFilter} checked={this.state.filter.showExpired} />
                                                        <Form.Checkbox label={'Unexpired Jobs'}
                                                            name="showUnexpired" onChange={this.jobsFilter} checked={this.state.filter.showUnexpired} />
                                                    </Form.Group>
                                                </Form>
                                            </Dropdown.Item>
                                            <div>
                                                <Button
                                                    className="ui positive button"
                                                    attached='bottom'
                                                    content='Reload'
                                                    onClick={() => this.loadNewData({ activePage: 1 })} 
                                                />
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </span>
                                {'  '}
                                <span>
                                    <i className="calendar icon" />
                                    {"Sort by date: "}
                                    <Dropdown inline simple options={orderOptions}
                                        onChange={this.handleOrderChange}
                                        value={this.state.sortedOrder}
                                    />
                                </span>
                                <br />
                                <br />
                                <div className="ui three cards" >
                                    {
                                        jobList != null ? jobList :
                                            <div className='row'>
                                                <br />
                                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No Jobs Found</p>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="six column centered row">
                            <div className="column">
                                <Pagination
                                    activePage={this.state.activePage}
                                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    totalPages={this.state.totalPages}
                                    onPageChange={this.handlePaginationChange}
                                    />
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            </BodyWrapper>
        )
    }
}