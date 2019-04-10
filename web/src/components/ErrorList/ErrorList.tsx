import React from "react";
import styled from "styled-components";

interface ErrorListProps {
  title?: string;
  errors: string[];
  prettifyResults: (string) => void
}

export const ErrorList = (props: ErrorListProps) => (
  <Wrapper>
    {props.title || "An error occurred:"}
    <ul>
      {props.errors.map(e => (
        <li key={e}>{e}</li>
      ))}

    </ul>
    this.props.prettifyResults(props.errors)
  </Wrapper>
);

const Wrapper = styled.div`
  background-color: #cc0000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
`;
