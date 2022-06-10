import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Tab, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RenderRow from '../../../components/RenderRow';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const address = props.query.address;
        const campaign = Campaign(address);
        const requestsCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.getApproversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestsCount)).fill().map((request, index) => {
                return campaign.methods.requests(index).call();
            })
        )
        return {
            address: address,
            requests: requests,
            approversCount: approversCount,
            reqCount: requestsCount
        }
    }


    renderRows() {
        return this.props.requests.map((req, index) => {
            return <RenderRow key={index} id={index} request={req} address={this.props.address} approversCount={this.props.approversCount}/>
        })
    }

    render() {
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated='right' style={{marginBottom: 10}}>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell singleLine>Id</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount (ether)</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                </Table>
                <div>Found {this.props.reqCount} Requests</div>
            </Layout>
        )
    }
}

export default RequestIndex;