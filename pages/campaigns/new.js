import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router} from '../../routes'

class CampaingNew extends Component {
    state = {
        contractDescription: '',
        minimumContribution: '',
        errorMsg: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMsg:''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                         .createCampaign(this.state.minimumContribution, this.state.contractDescription)
                         .send({
                            from: accounts[0]
                         });
            Router.pushRoute('/');
        } catch(err) {
            this.setState({errorMsg: err.message});
        }
        this.setState({loading: false});

    }

    render() {
        return (
                <Layout>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                        <h3>Create a campaign</h3>
                        <Form.Field>
                            <label>Add description</label>
                            <Input  value={this.state.contractDescription}
                                    onChange={event => this.setState({contractDescription: event.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Minimum contribution</label>
                            <Input  label="wei"
                                    labelPosition='right'
                                    value={this.state.minimumContribution}
                                    onChange={event => this.setState({minimumContribution: event.target.value})}>
                                    </Input>
                        </Form.Field>
                        <Message error header="Something went wrong!!!" content={this.state.errorMsg}/>
                        <Button primary loading={this.state.loading}>Create</Button>
                    </Form>
                </Layout>
            );
    }
}

export default CampaingNew;