import * as React from "react";

import styles from "../../styles/shared.scss";
import { Text } from "./text";
import { Title } from "./title";

export const Who: React.FunctionComponent = () => (
    <div>
        <Title value="WHO" />

        <div className={ styles.textWrapper }>
            <Text text={
                `Mathias Paumgarten is a freelance, award winning creative developer. He wrote this short
                bio in thrid person to appear serious and professional, but make no mistake. It’s mearly
                a facade to the playful and  at times inappropriate coder that was born and raised in
                Austria, and currently lives in Oakland California.` } />

            <Text text={
                `After years of working at world class Agencies such as B-Reel, Firstborn and others he
                dabbeled with the best of Silicon Valley working as creative engineer at Google. Lusting
                for a wider spectrum of partnerships, he decided to become a freelancer.` } />
        </div>
    </div>
);
