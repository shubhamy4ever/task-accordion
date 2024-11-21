import React, { useState } from 'react';
import AccordionComponent from '../../components/accordion/accordion';
import { accordionData, AccordionItem } from './constants';
import { Accordion } from 'react-bootstrap';
import AccordionFormContent from '../../components/accordion/accordion-formcontent';

interface AccordionData {
  [accordionId: number]: { [questionIndex: number]: string };
}

const AccordionSection: React.FC = () => {
  const initializeAccordionValues = (): AccordionData => {
    const initialValue: AccordionData = {};
    accordionData.accordions.forEach((accordion, accordionIndex) => {
      initialValue[accordionIndex] = {};
      accordion.children.forEach((child, childIndex) => {
        initialValue[accordionIndex][childIndex] = child.type === "radio" ? "No" : "";
      });
    });
    return initialValue;
  };

  const [accordionValues, setAccordionValues] = useState<AccordionData>(initializeAccordionValues);
  const [editableAccordions, setEditableAccordions] = useState<boolean[]>(
    accordionData.accordions.map((_, index) => index === 0)
  );
  const [formChanged, setFormChanged] = useState<boolean[]>(
    accordionData.accordions.map(() => false)
  );

  const updateAccordionValues = (accordionId: number, questionIndex: number, value: string) => {
    setAccordionValues(prevValues => ({
      ...prevValues,
      [accordionId]: {
        ...prevValues[accordionId],
        [questionIndex]: value,
      },
    }));

    setFormChanged(prev => {
      const updated = [...prev];
      updated[accordionId] = true;
      return updated;
    });
  };

  const saveAccordionChanges = (accordionIndex: number) => {
    const updatedEditableAccordions = [...editableAccordions];
    const hasNoValue = Object.values(accordionValues[accordionIndex]).includes("No");

    for (let i = accordionIndex + 1; i < updatedEditableAccordions.length; i++) {
      updatedEditableAccordions[i] = !hasNoValue && !Object.values(accordionValues[i - 1]).includes("No");
    }

    setEditableAccordions(updatedEditableAccordions);

    setFormChanged(prev => {
      const updated = [...prev];
      updated[accordionIndex] = false;
      return updated;
    });
  };

  const renderFooterActions = (accordionIndex: number) => (
    <div className='d-flex' style={{marginLeft: 12}}>
      <span
        role='button'
      
        onClick={() => saveAccordionChanges(accordionIndex)}
        className="m-2 text-danger"
        
      >
        Save
      </span>
      <span role='button' className='m-2'>Cancel</span>
    </div>
  );

  return (
    <AccordionComponent style={{ margin: '0 10vw' }}>
      {accordionData.accordions.map((accordion: AccordionItem, index: number) => (
        <Accordion.Item key={accordion.id} eventKey={index.toString()}>
          <Accordion.Header>{accordion.heading}</Accordion.Header>
          <Accordion.Body>
            <AccordionFormContent
              children={accordion.children}
              editable={editableAccordions[index]}
              onRadioChange={(value, questionIndex) => updateAccordionValues(index, questionIndex, value)}
              renderFooter={formChanged[index] ? () => renderFooterActions(index) : undefined}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </AccordionComponent>
  );
};

export default AccordionSection;
