import React, { Component } from 'react';
import Layout from '../../components/Layout';
import campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link, Router } from '../../routes';

class CamapaignShow extends Component {
    static async getInitialProps(props) {
        const address = props.query.address;
        const summary = await campaign(address).methods.getCampaingDetails().call();
        console.log(summary);
        return {
            campaignAddress: address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            description: summary[5]
        };
    }

    renderCard() {
        const items = [
            {
                header: this.props.manager,
                meta: 'Manager address',
                description: 'The manager created this campaign and can create request to withdraw money',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: 'Campaing Description',
                description: this.props.description,
                style: {overflowWrap: 'break-word'}
            },
            {
                header: this.props.minimumContribution,
                meta: 'Mimimum contribution (wei)',
                description: 'The minimum donation must be paid to the campaign',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(this.props.balance, 'ether'),
                meta: 'Balance (ether)',
                description: 'How much money this campaign has left to spend.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: this.props.requestsCount,
                meta: 'Requests count',
                description: 'The request tries to withdraw money from the contract. Request must be approved by contributors ',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: this.props.approversCount,
                meta: 'Approvers count',
                description: 'People have already donated to this campaign',
                style: {overflowWrap: 'break-word'}
            }
        ]

        return items;
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Card.Group items={this.renderCard()} />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.campaignAddress}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <a><Button primary> View Requests</Button></a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default CamapaignShow;