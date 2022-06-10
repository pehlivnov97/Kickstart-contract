import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RenderRow extends Component {
    state = {
        loading: false,
        loadingFinalize: false,
        errorMsg: ''
    }

    onApprove = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true});
        try {
            await campaign.methods.approveRequest(this.props.id)
            .send({
                from: accounts[0]
            });
        } catch (err) {
            this.setState({loading: false});
        }
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        this.setState({loading: false});
    }

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        this.setState({loadingFinalize: true});
        try {
            await campaign.methods.finalizeRequest(this.props.id)
            .send({
                from: accounts[0]
            });
        } catch (err) {
            this.setState({loadingFinalize: false});
        }
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        this.setState({loadingFinalize: false});
    }

    render() {
        const readyToFinalize = this.props.request.approvalsCount > this.props.approversCount / 2;

        return (
            <Table.Row disabled={this.props.request.complete}
                       positive={readyToFinalize && !this.props.request.complete}>
                <Table.Cell>
                    {this.props.id}
                </Table.Cell>
                <Table.Cell>
                    {this.props.request.description}
                </Table.Cell>
                <Table.Cell>
                    {web3.utils.fromWei(this.props.request.value, 'ether')}
                </Table.Cell>
                <Table.Cell>
                    {this.props.request.recipient}
                </Table.Cell>
                <Table.Cell>
                    {this.props.request.approvalsCount}/{this.props.approversCount}
                </Table.Cell>
                <Table.Cell>
                    {this.props.request.complete ? null : <Button loading={this.state.loading} color='green' basic onClick={this.onApprove}>Approve</Button>}
                </Table.Cell>
                <Table.Cell>
                   {this.props.request.complete ? null : <Button loading={this.state.loadingFinalize} color='blue' basic onClick={this.onFinalize}>Finalize</Button>}
                </Table.Cell>
            </Table.Row>

        )
    }
}

export default RenderRow;