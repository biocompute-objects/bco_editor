import React from 'react';
import { useParams } from "react-router";

import { makeStyles } from '@material-ui/styles';
import {
	Card,
	CardContent,
	Grid,
	Typography
} from '@material-ui/core';
import exampleBCO from './example';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(4)
	},
	preWrap: {
		whiteSpace: 'pre-wrap'
	}
}));

export default props => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Grid
				container
				spacing={4}
			>
				<Grid
					item
					lg={12}
					md={12}
					xl={12}
					xs={12}
				>
					<Typography
						component="h2"
						variant="h2"
					>
						Sample BcoObject
            	</Typography>
				</Grid>
				<Grid
					item
					lg={12}
					md={12}
					xl={12}
					xs={12}
				>
					<Card>
						<CardContent>
							<pre className={classes.preWrap}>{JSON.stringify(exampleBCO, null, 4)}</pre>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
}