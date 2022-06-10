import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class Contribute extends Component {
    state = {
        value: '',
        loading: false,
        errorMsg: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const Campaign = campaign(this.props.address);

        this.setState({loading: true, errorMsg:''});
        try {
            const accounts = await web3.eth.getAccounts();
            await Campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            //Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({errorMsg: err});
        }

        Router.pushRoute(`/campaigns/${this.props.address}`)
        this.setState({loading: false, errorMsg:''});

    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input  label="ether"
                            labelPosition='right'
                            value={this.state.value}
                            onChange={event => {
                                this.setState({value: event.target.value});
                            }}/>
                </Form.Field>
                <Message error header="Something went wrong!!!" content={this.state.errorMsg}/>
                <Button primary loading={this.state.loading}> Contribute! </Button>
            </Form>
        )
    }
}

export default Contribute;