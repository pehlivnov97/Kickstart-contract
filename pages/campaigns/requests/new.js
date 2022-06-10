import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import web3 from '../../../ethereum/web3';
import campaing from '../../../ethereum/campaign';
import { Router } from '../../../routes';

class RequestNew extends Component {
    static async getInitialProps(props) {
        const address = props.query.address;
        console.log('aaaddress ' + address);

        return {
            address: address
        }
    }

    state =  {
        description: '',
        amount: '',
        recipient: '',
        loading: false,
        errorMsg: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const address = this.props.address;

        console.log(this.state.recipient);
        this.setState({loading: true, errorMsg: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaing(address).methods
                     .createRequest(this.state.description,
                                    web3.utils.toWei(this.state.amount, 'ether'),
                                    this.state.recipient)
                    .send({
                        from: accounts[0]
                    });
            Router.pushRoute(`/campaigns/${address}/requests`)
        } catch (err) {
            this.setState({errorMsg: err});
        }
        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h3>Create Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value = {this.state.description}
                            onChange = {event => {this.setState({description: event.target.value})}}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Amount</label>
                        <Input
                            label = 'ether'
                            labelPosition='right'
                            value = {this.state.amount}
                            onChange = {event => {this.setState({amount: event.target.value})}}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value = {this.state.recipient}
                            onChange= {event => {this.setState({recipient: event.target.value})}}/>
                    </Form.Field>
                    <Message error header="Something went wrong!!!" content={this.state.errorMsg}/>
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew;