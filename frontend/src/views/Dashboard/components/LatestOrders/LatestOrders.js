import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  Link
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import mockData from './data';
// import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

// const statusColors = {
//   delivered: 'success',
//   pending: 'info',
//   refunded: 'danger'
// };

const LatestOrders = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [orders] = useState(mockData);

  const getCreatedBy = province => {
    let users = [];
    province.contributors.forEach(item => {
      if (item.contribution.includes('createdBy')) {
        users.push(item.email);
        console.log(orders)
      }
    });
    return users.join(', ');
  }

  const getAccessList = province => {
    let users = [];
    province.contributors.forEach(item => {
      if (!item.contribution.includes('createdBy')) {
        users.push(item.email);
      }
    });
    return users.join(', ');
  }
  

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Button
            color="primary"
            size="small"
            variant="outlined"
            onClick={props.onGotoNewBco}
          >
            New BioCompute Object
          </Button>
        }
        title="Bco Object List"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Obect ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Created On
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Access List</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data.map(order => (
                  <TableRow
                    hover
                    key={order.id}
                  >
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/detail/${order.id}`}
                      >
                        {order.bco_id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.provenance_domain.name}</TableCell>
                    <TableCell>{moment(order.provenance_domain.created).format('MM/DD/YYYY')}</TableCell>
                    <TableCell>
                      {getCreatedBy(order.provenance_domain)}
                    </TableCell>
                    <TableCell>
                      {getAccessList(order.provenance_domain)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
