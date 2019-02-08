import * as React from 'react'
import PlaceholderLink from "../components/PlaceholderLink";
import { Link } from 'react-router-dom';

function testBit(num: number, bit: number){
    return ((num>>bit) % 2 != 0)
}

export default (bv: number, juniorId: number) => {
    const actions = [{
        place: 3,
        element: <PlaceholderLink>{"Edit Information"}</PlaceholderLink>
    }, {
        place: 4,
        element: <Link to={"/ratings/" + juniorId}>{"View Ratings"}</Link>
    }, {
        place: 5,
        element: <PlaceholderLink>{"Signup for Summer Classes"}</PlaceholderLink>
    }, {
        place: 6,
        element: <PlaceholderLink>{"Signup for Fall Classes"}</PlaceholderLink>
    }, {
        place: 7,
        element: <PlaceholderLink>{"Signup for Spring Classes"}</PlaceholderLink>
    }, {
        place: 8,
        element: <PlaceholderLink>{"Cancel Membership Purchase"}</PlaceholderLink>
    }, {
        place: 9,
        element: <PlaceholderLink>{"Cancel Class Purchase"}</PlaceholderLink>
    }, {
        place: 10,
        element: <PlaceholderLink>{"Enroll and Pay for Fall Class"}</PlaceholderLink>
    }, {
        place: 11,
        element: <PlaceholderLink>{"Enroll and Pay for Spring Class"}</PlaceholderLink>
    }, {
        place: 12,
        element: <PlaceholderLink>{"Cancel Fall Class Waitlist"}</PlaceholderLink>
    }, {
        place: 13,
        element: <PlaceholderLink>{"Cancel Spring Class Waitlist"}</PlaceholderLink>
    }, {
        place: 14,
        element: <PlaceholderLink>{"Rejoin Waitlist"}</PlaceholderLink>
    }, {
        place: 15,
        element: <PlaceholderLink>{"Buy 4th of July Tickets"}</PlaceholderLink>
    }]

    return (function() {
        if (testBit(bv, 0)) {
            return [<PlaceholderLink>{"Purchase Summer Membership and/or Spring Class"}</PlaceholderLink>];
        } else if (testBit(bv, 1)) {
            return [<PlaceholderLink>{"Purchase Summer Membership"}</PlaceholderLink>];
        } else if (testBit(bv, 2)) {
            return [<PlaceholderLink>{"Edit Registration"}</PlaceholderLink>]
        } else return [];
    }()).concat(actions.filter(({place}) => testBit(bv, place)).map(({element}) => element))
    .map((element, i) => <li key={i}>{element}</li>)
}