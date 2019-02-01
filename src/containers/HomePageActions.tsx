import * as React from 'react'
import PlaceholderLink from "../components/PlaceholderLink";

function testBit(num: number, bit: number){
    return ((num>>bit) % 2 != 0)
}

export default (bv: number) => {
    const actions = [{
        place: 3,
        text: "Edit Information"
    }, {
        place: 4,
        text: "View Ratings"
    }, {
        place: 5,
        text: "Signup for Summer Classes"
    }, {
        place: 6,
        text: "Signup for Fall Classes"
    }, {
        place: 7,
        text: "Signup for Spring Classes"
    }, {
        place: 8,
        text: "Cancel Membership Purchase"
    }, {
        place: 9,
        text: "Cancel Class Purchase"
    }, {
        place: 10,
        text: "Enroll and Pay for Fall Class"
    }, {
        place: 11,
        text: "Enroll and Pay for Spring Class"
    }, {
        place: 12,
        text: "Cancel Fall Class Waitlist"
    }, {
        place: 13,
        text: "Cancel Spring Class Waitlist"
    }, {
        place: 14,
        text: "Rejoin Waitlist"
    }, {
        place: 15,
        text: "Buy 4th of July Tickets"
    }]

    return (function() {
        if (testBit(bv, 0)) {
            return ["Purchase Summer Membership and/or Spring Class"];
        } else if (testBit(bv, 1)) {
            return ["Purchase Summer Membership"];
        } else if (testBit(bv, 2)) {
            return ["Edit Registration"]
        } else return [];
    }()).concat(actions.filter(({place}) => testBit(bv, place)).map(({text}) => text))
    .map(text => <li><PlaceholderLink>{text}</PlaceholderLink></li>)
}