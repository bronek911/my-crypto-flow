import React, { useState } from 'react';

import { Form, Container, Row, Col, Button } from 'react-bootstrap'
import CoinGeko from '../../dataProviders/CoinGeko';
import { WindowedMenuList } from 'react-windowed-select';
import CreatableSelect from 'react-select/creatable';

import './AddForm.css';

const fs = require('fs');

class AddForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coins: props.coins,
            selectedCoin: ''
        };
        this.createCoinsSelect = this.createCoinsSelect.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
        CoinGeko.getCurrencies().then((data) => {
            this.setState({ coins: data })
        })
    }

    render() {

        return (
            <Form onSubmit={this.props.handleAddRecord}>
                <Container>
                    <Row>

                        <Col xs="5">
                            <Form.Group controlId="addForm.Amount">
                                <Form.Control type="number" step="0.000000001" placeholder="Set amount of bought currency" />
                            </Form.Group>
                        </Col>

                        <Col xs="5">
                            <Form.Group controlId="addForm.Currency">
                                <input type="hidden" value={this.state.selectedCoin}/>
                                <CreatableSelect
                                    components={{ MenuList: WindowedMenuList }}
                                    options={this.state.coins} 
                                    onChange={this.handleSelectChange} />
                            </Form.Group>
                        </Col>

                        <Col xs="2">
                            <Button as="input" type="submit" value="Save" />
                        </Col>

                    </Row>
                </Container>
            </Form>
        );
    }

    handleSelectChange(event){
        this.setState({selectedCoin: event.value});
    }

    createCoinsSelect() {
        let data = this.state.coins.map((element) => {
            return { value: element, label: element }
        })
        return data
    }
}

export default AddForm;