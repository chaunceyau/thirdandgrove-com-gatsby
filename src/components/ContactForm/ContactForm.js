/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { css } from '@emotion/core';

import Input from '../Input';
import Button from '../Button';
import TextArea from '../TextArea';
import { mediaQueries, colors } from '../../styles';

const ContactFrom = () => {
  const [formState, updateForm] = useState({
    comments: '',
    email: '',
    name: '',
    phone: '',
    website: '',
  });
  const [errors, updateErrors] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const updateInput = event => {
    updateErrors(null);
    updateForm({ ...formState, [event.target.name]: event.target.value });
  };

  const encode = data => {
    return Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  };

  const submitContact = event => {
    event.preventDefault();
    const { name, email, website } = formState;
    if (hasSubmitted) {
      // deter multiple submissions
      updateErrors({ error: 'The form has already been submitted.' });
      return;
    }
    // validate inputs
    if (!name || !email || !website) {
      // notify user of required fields
      const currentErrs = {};
      if (!name) {
        currentErrs.name = 'Name is required';
      }
      if (!website) {
        currentErrs.website = 'Website is required';
      }
      if (!email) {
        currentErrs.email = 'Email is required';
      }
      updateErrors(currentErrs);
      return;
    }
    if (!website.includes('.') && website.length > 3) {
      // currently we only validate that a dot is present
      // a more strict validation could exclude valid edgecases
      updateErrors({ website: 'Website must be valid' });
      return;
    }
    // the form has not been submitted
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...formState }),
    }).then(() => {
      updateForm({
        comments: 'Thank you for your inquiry.',
        email: '',
        name: '',
        phone: '',
        website: '',
      });
      setHasSubmitted(true);
    });
  };

  // eslint-disable-next-line react/prop-types
  const ErrorToaster = ({ errs }) => {
    return errs ? (
      <span
        css={css`
          position: absolute;
          align-self: center;
          width: 100%;
          text-align: center;
          p {
            display: inline;
            color: ${colors.red};
          }
        `}
      >
        {errs &&
          Object.values(errs).map((err, i) => (
            <p key={err}>
              {err}{' '}
              {i !== Object.keys(errs).length - 1 && <span>&nbsp;-&nbsp;</span>}
            </p>
          ))}
      </span>
    ) : null;
  };

  return (
    <main
      css={css`
        margin: 0 auto;
        margin-top: 2rem;
        width: 100vw;
        display: flex;
        flex-direction: column;
        ${mediaQueries.phoneLarge} {
          width: 980px;
        }
      `}
    >
      <form
        name='contact'
        method='POST'
        data-netlify='true'
        data-cy='contactForm'
        netlify-honeypot='bot-field'
        onSubmit={submitContact}
      >
        <input type='hidden' name='contact' value='contact' />
        <span
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 3rem;

            ${mediaQueries.phoneLarge} {
              display: grid;
              grid-template-columns: repeat(2, 480px);
              grid-column-gap: 1rem;
              margin: 0;
              align-items: stretch;
            }
          `}
        >
          <Input
            value={formState.name}
            onChange={updateInput}
            type='text'
            placeholder='name'
            name='name'
          />
          <Input
            value={formState.email}
            onChange={updateInput}
            type='email'
            placeholder='email'
            name='email'
          />
          <Input
            value={formState.website}
            onChange={updateInput}
            placeholder='website'
            name='website'
          />
          <Input
            value={formState.phone}
            onChange={updateInput}
            type='tel'
            placeholder='phone [optional]'
            name='phone'
          />
        </span>
        <span
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 3rem;
            ${mediaQueries.phoneLarge} {
              display: inline;
              margin: 0;
            }
          `}
        >
          <TextArea
            value={formState.comments}
            onChange={updateInput}
            data-cy='messageField'
            name='comments'
            placeholder='Leave a message'
          />
        </span>
        <span
          css={css`
            display: flex;
            justify-content: center;
            margin-top: 4rem;
          `}
        >
          <Button data-cy='contactSubmit' type='submit'>
            send
          </Button>
        </span>
        <span
          css={css`
            display: flex;
            justify-content: center;
            margin-top: 4rem;
            flex-direction: column;
          `}
        >
          <ErrorToaster errs={errors} />
        </span>
      </form>
    </main>
  );
};

export default ContactFrom;
