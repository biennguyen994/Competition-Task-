import React from 'react';
import Cookies from 'js-cookie';
import { Card } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this),
        this.handleCopy = this.handleCopy.bind(this),
        this.handleEdit = this.handleEdit.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success == true) {
                    this.props.reloadData();

                    TalentUtil.notification.show(data.message, "success", null, null)
                } else {
                    TalentUtil.notification.show(data.message, "error", null, null)
                }
            }.bind(this)
        })
    }

    handleEdit(id) {
        window.location = "/EditJob/" + id
    }

    handleCopy(id) {
        window.location = "/PostJob/" + id
    }

    render() {
        let jobdata = this.props.data;
        let buttonGroup = null;
        if (jobdata.status == 0) {
            buttonGroup =
                <div className="ui right floated mini buttons">
                    <button className="right floated ui mini basic blue button" onClick={this.selectJob.bind(this, jobdata.id)}>
                        <i className="ban icon" />Close
                    </button>
                    <button className="right floated ui mini basic blue button" onClick={this.handleEdit.bind(this, jobdata.id)}>
                        <i className="edit icon" />Edit
                    </button>
                    <button className="right floated ui mini basic blue button" onClick={this.handleCopy.bind(this, jobdata.id)}>
                        <i className="copy icon" />Copy
                    </button>
                </div>
        }
        else {
            buttonGroup =
                <button className="right floated ui mini basic blue button" onClick={this.handleCopy.bind(this, jobdata.id)}>
                    <i className="copy icon" />Copy
                </button>
        }
        return (
            <Card>
                <Card.Content>
                    <Card.Header>{jobdata.title}</Card.Header>
                    <a className="ui black right ribbon label"><i className="user icon"></i>{jobdata.noOfSuggestions}</a>
                    <Card.Meta>{jobdata.location.city}, {jobdata.location.country}</Card.Meta>
                    <Card.Description className="description job-summary"> {jobdata.summary}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {buttonGroup != null ? buttonGroup : null}
                    {
                        moment(jobdata.expiryDate) < moment() ?
                            <label className="ui red left floated label">
                                Expired
                    </label> : null}
                </Card.Content>
            </Card>
        )
    }
}