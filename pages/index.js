import React,  { Component } from 'react';
import factory from '../ethereum/factory';
import Campaign from '../ethereum/campaign';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';


class CampaignIndex extends Component{
    static async getInitialProps() {
        const campaigns = await factory.methods.fetchAllCampaigns().call();
        return {campaigns: campaigns};
    }

    renderCamapigns() {
        const items = this.props.campaigns.map(address => {
            return {
                    header: address,
                    description: (<Link route={`/campaigns/${address}`}><a>View campaign</a></Link>),
                    fluid: true
                };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (<Layout>
                    <div>
                        <h3>Open campaigns</h3>
                        <Link route="/campaigns/new">
                            <a>
                                <Button floated="right"content="Create Campaing" icon="add circle" primary/>
                            </a>
                        </Link>
                        {this.renderCamapigns()}
                    </div>
                </Layout>
                )
    }
}

export default CampaignIndex;