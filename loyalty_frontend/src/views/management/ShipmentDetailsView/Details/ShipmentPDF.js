/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet
} from '@react-pdf/renderer';
import { buildCommaSeparatedString, convertToPlain } from 'src/utils/helper';

const COL1_WIDTH = 60;
// const COLN_WIDTH = (100 - COL1_WIDTH) / 2;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 24
  },
  h1: {
    fontSize: 20,
    fontWeight: 800
  },
  h5: {
    fontSize: 11,
    fontWeight: 500,
  },
  h6: {
    fontSize: 10,
    fontWeight: 500
  },
  body1: {
    fontSize: 11,
    lineHeight: 1.2
  },
  body2: {
    fontSize: 12,
    lineHeight: 1.5
  },
  body3: {
    fontSize: 8,
    lineHeight: 1.5
  },
  body4: {
    fontSize: 10,
    lineHeight: 1.2
  },
  mb1: {
    marginBottom: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brand: {
    height: 50,
    width: 50
  },
  company: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  references: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  billing: {
    marginTop: 32
  },
  items: {
    marginTop: 32
  },
  notes: {
    marginTop: 32
  },
  table: {
    display: 'table',
    width: 'auto',
  },
  tableHeader: {},
  tableBody: {},
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    borderStyle: 'solid'
  },
  tableCell1: {
    padding: 6,
    width: `${COL1_WIDTH}%`
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: 'bolder',
    borderLeftWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    textAlign: 'center',
  },
  tableBodyCell: {
    fontSize: 12,
    fontWeight: 500,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right'
  },
  textInRectangle: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 3,
  },
  rectangleOne: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 3,
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  marginBottomOne: {
    marginBottom: 3,
  },
  marginTopOne: {
    marginTop: 2,
  },
  paddingOne: {
    padding: 1,
  },
  dateFieldWrapper: {
    width: 260,
  },
  marginTopTwo: {
    marginTop: 15,
  },
  displayFlexRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  paddingLeft3: {
    paddingLeft: 3,
  },
  paddingTop3: {
    paddingTop: 3,
  },
  paddingRight3: {
    paddingRight: 3,
  },
  paddingBottom3: {
    paddingBottom: 3,
  },
  padding3: {
    padding: 3,
  },
  padding2: {
    padding: 2,
  },
  lineHeight1_5: {
    lineHeight: 1.5
  }
});

function ShipmentPDF({ shipment }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.displayFlexRow}>
            <View style={[{ paddingRight: 10 }]}>
              <Image
                source="/static/images/pdf-logo.png"
                style={styles.brand}
              />
            </View>
            <View>
              <Text style={[styles.h5, styles.lineHeight1_5]}>
                Loyalty Global Logistics
              </Text>
              <Text style={[styles.h5, styles.lineHeight1_5]}>
                6901 Marlin Cir
              </Text>
              <Text style={[styles.h5, styles.lineHeight1_5]}>
                La Palma, CA 90623
              </Text>
              <Text style={[styles.h5, styles.lineHeight1_5]}>
                Tel: 833-744-7545 Fax:
              </Text>
              <Text style={[styles.h5, styles.lineHeight1_5]}>
                lglship.com
              </Text>
            </View>
          </View>
          {/* Top right */}
          <View style={styles.displayFlexRow}>
            <View
              style={[{ width: 100, }]}
            >
              <Text style={[styles.h5]}>
                HAWB #
                {' '}
              </Text>
              <Text style={styles.h5}>
                Origin
              </Text>
              <Text style={styles.h5}>
                Destination
              </Text>
              <Text style={styles.h5}>
                Pick Up Date
              </Text>
              <Text style={styles.h5}>
                Deliv Date
              </Text>
              <Text style={styles.h5}>
                COD
              </Text>
              <Text style={styles.h5}>
                Charges
              </Text>
              <Text style={styles.h5}>
                Project #
              </Text>
              <Text style={styles.h5}>
                Sales Rep
              </Text>
            </View>
            <View>
              <Text style={[styles.h5, { fontWeight: '800', fontSize: '13' }]}>
                :
                {' '}
                {shipment.title}
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
                {shipment.originCountry}
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
                {shipment.destCountry}
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
                {moment(shipment.dueStart).format('MM/DD/YYYY')}
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
                {moment(shipment.dueEnd).format('MM/DD/YYYY')}
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
                Shipper
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
              </Text>
              <Text style={styles.h5}>
                :&nbsp;
                {shipment.customer[0].firstName}
                &nbsp;
                {shipment.customer[0].lastName}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.marginTopTwo}>
          <View style={[styles.textInRectangle, { borderWidth: 2, textAlign: 'center' }]}>
            <Text style={[styles.body1, styles.marginTopOne, styles.paddingOne, styles.h1]}>
              Domestic House Waybill
              {' '}
              {shipment.title}
            </Text>
          </View>
        </View>
        {/* Shipper, Consignee, Billing Party */}
        <View style={[styles.displayFlexRow, { marginTop: 10 }]}>
          <View style={[{ borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#000', width: 183, }]}>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#000', margin: 0 }]}>
              Shipper
            </Text>
            <View>
              <Text style={[styles.body1, styles.paddingLeft3, styles.paddingTop3]}>
                {shipment.originCompany === '' ? ' ' : shipment.originCompany}
              </Text>
              <Text style={[styles.body1, styles.paddingLeft3]}>
                {shipment.originAptSuite === '' ? ' ' : shipment.originAptSuite}
              </Text>
              <Text style={[styles.body1, styles.paddingLeft3]}>
                {buildCommaSeparatedString([shipment.originCity, shipment.originCountry, shipment.originPostalCode]) === '' ? ' ' : buildCommaSeparatedString([shipment.originCity, shipment.originCountry, shipment.originPostalCode])}
              </Text>
              <Text>
                &nbsp;
              </Text>
              <View style={[styles.displayFlexRow]}>
                <View>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    &nbsp;&nbsp;Attn:
                  </Text>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Tel:
                  </Text>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    Ref #&nbsp;
                  </Text>
                </View>
                <View>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    shipping
                  </Text>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    &nbsp;
                  </Text>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
              <View style={[styles.displayFlexRow, { textAlign: 'center', marginTop: 10 }]}>
                <View style={[{ width: 70 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                    Pick Up Date
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1 }]}>
                    {moment(shipment.dueStart).format('MM/DD/YYYY')}
                  </Text>
                </View>
                <View style={[{ width: 60 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                    Pick Up By
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1 }]}>
                    {moment(shipment.dueStart).format('HH:mm:ss')}
                  </Text>
                </View>
                <View style={[{ width: 53 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1 }]}>
                    Closing
                  </Text>
                  <Text style={[styles.body4, styles.padding2]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[{ borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#000', width: 183, }]}>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#000', margin: 0 }]}>
              Consignee
            </Text>
            <View>
              <Text style={[styles.body1, styles.paddingLeft3, styles.paddingTop3]}>
                {shipment.destCompany === '' ? ' ' : shipment.destCompany}
              </Text>
              <Text style={[styles.body1, styles.paddingLeft3]}>
                {shipment.destAptSuite === '' ? ' ' : shipment.destAptSuite}
              </Text>
              <Text style={[styles.body1, styles.paddingLeft3]}>
                {buildCommaSeparatedString([shipment.destCity, shipment.destCountry, shipment.destPostalCode]) === '' ? ' ' : buildCommaSeparatedString([shipment.destCity, shipment.destCountry, shipment.destPostalCode])}
              </Text>
              <Text>
                &nbsp;
              </Text>
              <View style={[styles.displayFlexRow]}>
                <View>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    &nbsp;&nbsp;Attn:
                  </Text>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Tel:
                  </Text>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    Ref #&nbsp;
                  </Text>
                </View>
                <View>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    &nbsp;
                  </Text>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    &nbsp;
                  </Text>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
              <View style={[styles.displayFlexRow, { textAlign: 'center', marginTop: 10 }]}>
                <View style={[{ width: 70 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                    Delivery Date
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1 }]}>
                    {moment(shipment.dueEnd).format('MM/DD/YYYY')}
                  </Text>
                </View>
                <View style={[{ width: 60 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                    Delivery By
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1 }]}>
                    {moment(shipment.dueEnd).format('HH:mm:ss')}
                  </Text>
                </View>
                <View style={[{ width: 53 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1 }]}>
                    Closing
                  </Text>
                  <Text style={[styles.body4, styles.padding2]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[{ borderLeftWidth: 1, borderColor: '#000', width: 183, borderRightWidth: 1 }]}>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#000', margin: 0 }]}>
              Billing party
            </Text>
            <View>
              <Text style={[styles.body1, styles.paddingLeft3, styles.paddingTop3]}>
                {shipment.customer[0].company === '' ? ' ' : shipment.customer[0].company}
              </Text>
              <Text style={[styles.body1, styles.paddingLeft3]}>
                {shipment.customer[0].aptSuite === '' ? ' ' : shipment.customer[0].aptSuite}
              </Text>
              <Text style={[styles.body1, styles.paddingLeft3]}>
                {buildCommaSeparatedString([shipment.customer[0].city, shipment.customer[0].country, shipment.customer[0].postalCode]) === '' ? ' ' : buildCommaSeparatedString([shipment.customer[0].city, shipment.customer[0].country, shipment.customer[0].postalCode])}
              </Text>
              <Text>
                &nbsp;
              </Text>
              <View style={[styles.displayFlexRow, { borderBottomWidth: 1, paddingBottom: 10 }]}>
                <View>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    &nbsp;&nbsp;Attn:
                  </Text>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Tel:
                  </Text>
                  <Text style={[styles.h5, styles.paddingLeft3]}>
                    Ref #&nbsp;
                  </Text>
                </View>
                <View>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    shipping
                  </Text>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    {shipment.customer[0].phone}
                  </Text>
                  <Text style={[styles.body1, styles.paddingLeft3]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
              <View style={[styles.displayFlexRow, { textAlign: 'center' }]}>
                <View style={[{ width: 100 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderBottomWidth: 1, borderRightWidth: 1 }]}>
                    Service
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, borderBottomWidth: 1 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 20 }]}>
                  <Text>&nbsp;</Text>
                </View>
                <View style={[{ width: 63 }]}>
                  <Text style={[styles.body4, styles.padding2]}>
                    &nbsp;
                  </Text>
                  <View style={[styles.displayFlexRow, { marginTop: 4, marginLeft: 5 }]}>
                    <View style={[{ borderWidth: 1, width: 30 }]}>
                      <Text style={[styles.body4]}>
                        TSA
                      </Text>
                    </View>
                    <View style={[{ borderWidth: 1, width: 20, borderLeftWidth: 0 }]}>
                      <Text style={[styles.body4]}>
                        U
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Special Instructions */}
        <View style={[{ borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, width: 549 }, styles.padding3]}>
          <Text style={[styles.h5]}>
            Special Instructions
          </Text>
        </View>
        <View style={[{ borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, width: 549 }, styles.padding3]}>
          <Text style={[styles.body4]}>
            {convertToPlain(shipment.customerNote)}
          </Text>
        </View>

        <View style={{ borderColor: '#000', borderWidth: 0, borderStyle: 'solid', padding: 0, width: 549 }}>
          <View style={[styles.displayFlexRow]}>
            <View style={[styles.tableHeaderCell, { width: '14%' }]}>
              <Text>
                Pieces
              </Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '14%' }]}>
              <Text>
                Type
              </Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '14%' }]}>
              <Text>
                Description
              </Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '14%' }]}>
              <Text>
                Length
              </Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '14%' }]}>
              <Text>
                Width
              </Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '14%' }]}>
              <Text>
                Height
              </Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '16%', borderRightWidth: 1 }]}>
              <Text>
                Weight
              </Text>
            </View>
          </View>

          {shipment.packagesTableData.map((row) => {
            if (row.pieces.trim() === ''
              && row.type.trim() === ''
              && row.description.trim() === ''
              && row.l.trim() === ''
              && row.w.trim() === ''
              && row.h.trim() === ''
              && row.weight.trim() === ''
            ) {
              return <></>;
            }
            return (
              <View style={[styles.displayFlexRow]}>
                <View style={[styles.tableBodyCell, { width: '14%' }]}>
                  <Text>
                    {row.pieces}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '14%' }]}>
                  <Text>
                    {row.type}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '14%' }]}>
                  <Text>
                    {row.description}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '14%' }]}>
                  <Text>
                    {row.l}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '14%' }]}>
                  <Text>
                    {row.w}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '14%' }]}>
                  <Text>
                    {row.h}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '16%', borderRightWidth: 1 }]}>
                  <Text>
                    {row.weight}
                  </Text>
                </View>
              </View>
            );
          })}
          {/* SHIPMENT TOTALS */}
          <View style={[styles.displayFlexRow]}>
            <View style={[styles.tableBodyCell, { width: '14%' }]}>
              <Text>
                &nbsp;
              </Text>
            </View>
            <View style={[styles.tableBodyCell, { width: '42%' }]}>
              <Text style={[{ backgroundColor: '#000', color: '#fff', borderBottomWidth: 1, borderRightWidth: 1 }]}>
                SHIPMENT  TOTALS
              </Text>
            </View>
            <View style={[styles.tableBodyCell, { width: '14%', borderBottomWidth: 1, borderRightWidth: 0 }]}>
              <Text>
                {shipment.packagesTableData.reduce((sum, row) => {
                  let val = parseInt(row.weight, 10);
                  if (isNaN(val)) {
                    val = 0;
                  }
                  sum += val;
                  return sum;
                }, 0)}
              </Text>
            </View>
            <View style={[styles.tableBodyCell, { width: '30%', borderLeftWidth: 1, borderTopWidth: 1, borderRightWidth: 1 }]}>
              <Text>
                &nbsp;
              </Text>
            </View>
          </View>
        </View>

        {/* Product Description */}
        <View style={[{ borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, width: 549 }, styles.padding3]}>
          <Text style={[styles.h5]}>
            &nbsp;
          </Text>
        </View>
        <View style={[{ borderLeftWidth: 1, borderRightWidth: 1, width: 549 }, styles.padding3]}>
          <Text style={[styles.body4]}>
            &nbsp;
          </Text>
          <View style={[styles.body4, { marginTop: 15 }, styles.displayFlexRow]}>
            <Text style={[styles.body4, { marginTop: 15, width: 370 }]}>
              Terms and Conditions as per Company Website-AIR Shipments are subject to Security Screening. Received, subject to individually determined rates or contracts that have been agreed upon in
            </Text>
            <View style={[styles.displayFlexRow, { marginTop: 15, marginLeft: 20 }]}>
              <View style={[styles.padding3, { borderWidth: 1, width: 100, height: 20 }]}>
                <Text style={[styles.body4]}>
                  Total Insurance
                </Text>
              </View>
              <View style={[styles.padding3, { borderWidth: 1, width: 50, borderLeftWidth: 0, height: 20 }]}>
                <Text style={[styles.body4]}>
                  {shipment.insured}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Shipper Signature, Pick-Up Driver Signatur, Consignee Signature */}
        <View style={[styles.displayFlexRow, { borderTopWidth: 0 }]}>
          <View style={[{ borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#000', width: 183, }]}>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#000', margin: 0, textAlign: 'center' }]}>
              Shipper Signature
            </Text>
            <View>
              <Text style={[styles.body1, styles.paddingLeft3, styles.paddingTop3, { height: 30 }]}>
                &nbsp;
              </Text>
              <View style={[styles.displayFlexRow, { textAlign: 'center', marginTop: 10 }]}>
                <View style={[{ width: 65 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, textAlign: 'left' }]}>
                    Date
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 65 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, textAlign: 'left' }]}>
                    Time
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 53 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, textAlign: 'left' }]}>
                    Pcs
                  </Text>
                  <Text style={[styles.body4, styles.padding2, {height: 35}]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1 }]}>
              Exceptions (Shipment received in good order unless noted)
            </Text>
          </View>
          <View style={[{ borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#000', width: 183, }]}>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#000', margin: 0, textAlign: 'center' }]}>
              Pick-Up Driver Signature
            </Text>
            <View>
              <Text style={[styles.body1, styles.paddingLeft3, styles.paddingTop3, { height: 30 }]}>
                &nbsp;
              </Text>
              <View style={[styles.displayFlexRow, { textAlign: 'center', marginTop: 10 }]}>
                <View style={[{ width: 65 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, textAlign: 'left' }]}>
                    Date
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 65 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, textAlign: 'left' }]}>
                    Time
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 53 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, textAlign: 'left' }]}>
                    Pcs
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1 }]}>
              Exceptions (Shipment received in good order unless noted)
            </Text>
          </View>
          <View style={[{ borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#000', width: 183, borderRight: 1 }]}>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#000', margin: 0, textAlign: 'center' }]}>
              Consignee Signature
            </Text>
            <View>
              <Text style={[styles.body1, styles.paddingLeft3, styles.paddingTop3, { height: 30 }]}>
                &nbsp;
              </Text>
              <View style={[styles.displayFlexRow, { textAlign: 'center', marginTop: 10 }]}>
                <View style={[{ width: 65 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, textAlign: 'left' }]}>
                    Date
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 65 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, textAlign: 'left' }]}>
                    Time
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { borderRightWidth: 1, height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
                <View style={[{ width: 53 }]}>
                  <Text style={[styles.body4, styles.padding2, { borderTopWidth: 1, borderBottomWidth: 1, textAlign: 'left' }]}>
                    Pcs
                  </Text>
                  <Text style={[styles.body4, styles.padding2, { height: 35 }]}>
                    &nbsp;
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.h5, styles.paddingLeft3, styles.paddingTop3, styles.paddingBottom3, { borderTopWidth: 1 }]}>
              Exceptions (Shipment received in good order unless noted)
            </Text>
          </View>

        </View>

      </Page>
    </Document>
  );
}

ShipmentPDF.propTypes = {
  shipment: PropTypes.object.isRequired
};

export default ShipmentPDF;
