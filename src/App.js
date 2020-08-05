import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
const mapMyIndUrl = 'http://digital-uat.dmart.in/api/v1/places?';
class App extends Component {
  state = {
    isLoading: false,
    pincode: '',
    addr1: '',
    addr2: [],
    addr1Suggestions: [],
    area: '',
    town: '',
    state: '',
    landmark: '',
  }

  handlePincodeChange = ({ target: { value } }) => {
    this.setState({
      pincode: value,
    })
  }

  handleLandmarkChange = ({ target: { value } }) => {
    this.setState({
      landmark: value,
    })
  }

  handleAddrOneChange = ({ target: { value } }) => {
    this.setState({
      addr1: value,
    })
  }

  handleAreaChange = ({ target: { value } }) => {
    this.setState({
      area: value,
    })
  }

  handleTownChange = ({ target: { value } }) => {
    this.setState({
      town: value,
    })
  }

  handleStateChange = ({ target: { value } }) => {
    this.setState({
      state: value,
    })
  }

  handleAddrTwoInputChange = (input) => {
    this.setState({
      isLoading: true,
    }, () => {
      this.fetchAddressSuggestions(input);
    });
  }

  fetchAddressSuggestions = async (input) => {
    const response = await axios.get(`${mapMyIndUrl}&pincode=${this.state.pincode}&place=${input}`).catch(err => console.log(err));
    const addr1Suggestions = response && response.data && response.data.suggestedLocations;
    if (addr1Suggestions && addr1Suggestions.length > 0) {
      this.setState({
        addr1Suggestions,
        isLoading: false,
      })
    }
  }

  handleAddrTwoChange = (addr2) => {
    const addrTokens = addr2[0] && addr2[0].addressTokens;
    console.log('addr2 addrTokens: ', addrTokens);
    if (addrTokens) {
      const addr1 = (addrTokens.houseName || addrTokens.houseNumber) ?
        addrTokens.houseNumber ? `${addrTokens.houseNumber}, ${addrTokens.houseName}` :
        addrTokens.houseName : this.state.addr1;
      this.setState({
        addr2,
        state: addrTokens.state,
        town: addrTokens.city,
        area: addrTokens.locality,
        pincode: addrTokens.pincode,
        // landmark: addrTokens.poi,
        addr1,
      });
    } else if (addr2.length === 0) {
      this.setState({
        addr2: [],
        state: '',
        town: '',
        area: '',
        pincode: '',
        // landmark: '',
        addr1: '',
      });
    }
  }

  render() {
    return (
      <Form>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Add Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="mobile">
                  <Form.Label>Mobile No.*</Form.Label>
                  <Form.Control type="tel" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="zipcode">
                  <Form.Label>Zipcode*</Form.Label>
                  <Form.Control type="number" onChange={this.handlePincodeChange} value={this.state.pincode} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="area">
                  <Form.Label>Area*</Form.Label>
                  <Form.Control type="text" disabled value={this.state.area} onChange={this.handleAreaChange}/>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="town">
                  <Form.Label>Town/City</Form.Label>
                  <Form.Control type="text" disabled value={this.state.town} onChange={this.handleTownChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" disabled value={this.state.state} onChange={this.handleStateChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="address1">
              <Form.Label>Flat no. (floor, building, company)*</Form.Label>
              <Form.Control type="text" value={this.state.addr1} onChange={this.handleAddrOneChange} />
            </Form.Group>
            <Form.Group controlId="address2">
              <Form.Label>Address ( locality, colony, street, sector )*</Form.Label>
              <Typeahead
                isLoading={this.state.isLoading}
                id="address2"
                labelKey="placeAddress"
                filterBy={() => true}
                onSearch={this.handleAddrTwoInputChange}
                onChange={this.handleAddrTwoChange}
                options={this.state.addr1Suggestions}
                clearButton
              />
            </Form.Group>
            <Form.Group controlId="landmark">
              <Form.Label>Landmark*</Form.Label>
              <Form.Control type="text" value={this.state.landmark} onChange={this.handleLandmarkChange}  />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Add Address
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Form>
    );
  }
}

export default App;
