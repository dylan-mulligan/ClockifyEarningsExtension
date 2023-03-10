'use strict';

function updateTrackerValue(mutationList: MutationRecord[], observer: MutationObserver) {
  const timeElement:  Element | null = <Element | null> mutationList[0].target.parentNode;
  if(timeElement === null) return;
  const moneySpan: Element | null = <Element | null> timeElement.previousSibling;
  if(moneySpan === null) return;
  
  let value: string;

  // Get updated value
  value = (timeElement as HTMLSpanElement).innerHTML;

  // Set updated value
  const newValue: string = getTimeMoneyValue(value);
  if(moneySpan.innerHTML !== newValue) moneySpan.innerHTML = newValue;
}

function updateEntryValue(mutationList: MutationRecord[], observer: MutationObserver) {
  const timeElement:  Element | null = <Element | null> mutationList[0].target.parentNode;
  console.dir(timeElement);
  if(timeElement === null) return;
  const moneySpan: Element | null = <Element | null> timeElement.previousSibling;
  console.dir(moneySpan);
  if(moneySpan === null) return;
  
  let value: string;

  // Get updated value
  value = (timeElement as HTMLInputElement).value;
  console.dir(value);

  // Set updated value
  const newValue: string = getTimeMoneyValue(value);
  console.dir(newValue);
  if(moneySpan.innerHTML !== newValue) moneySpan.innerHTML = newValue;
}

function getTimeMoneyValue(str: string): string {
  const timeVals: string[] = str.split(":");
  const hours: number = parseInt(timeVals[0]) + parseInt(timeVals[1]) / 60 + parseInt(timeVals[2]) / 3600;
  const salary: number = 45.0;
  
  return "$" + (hours * salary).toFixed(2);
}

function modifyTimer() {
  const tracker: Element = document.getElementsByClassName("cl-input-time-picker-sum")[0];
    let value: string;
    if(tracker === null) return;
    const tp = tracker.parentElement;
    if(tp === null) return;

    value = (tracker as HTMLSpanElement).innerHTML

    // Create element to display money value
    const moneyElement = document.createElement('span') as HTMLSpanElement;
    moneyElement.innerHTML = getTimeMoneyValue(value);
    moneyElement.id = 'tracker-value-span';
    // TODO: Position moneyElement centered
    
    // Create an observer instance linked to the callback function
    new MutationObserver(updateTrackerValue).observe(tp, {subtree: true, characterData: true});

    // Prepend element to parent component
    tp.prepend(moneyElement);
}

function modifyEntries() {
  // Get entries container
  const container: Element = <Element> document.getElementsByClassName("cl-tracker-entries-wrapper ng-star-inserted")[0].firstChild;

  // Attatch Observer
  new MutationObserver(updateEntryValue).observe(container, {subtree: true, childList: true});

  // Get tracker cards (1 per day)
  const trackerCards:HTMLCollectionOf<Element> = container.getElementsByClassName("cl-card");
  if(trackerCards.length === 0) return;

  // Iterate over tracker cards
  for (const tc of trackerCards) {
    // Get header
    const header: Element = tc.getElementsByTagName("entry-group-header")[0];
    // Get entries
    const trackerEntries:HTMLCollectionOf<Element> = tc.getElementsByTagName("time-tracker-entry");
    if(trackerEntries.length === 0) return;

    // Iterate over tracker entries
    for (const te of trackerEntries) {
      // Get time element
      const timeInput: HTMLInputElement = <HTMLInputElement> te.getElementsByClassName("cl-input-time-picker-sum")[0];
      // Get parent element
      const timeParent: Element | null = timeInput.parentElement;
      if(timeParent == null) return;

      // Create element to display money value
      const moneyElement = document.createElement('span') as HTMLSpanElement;
      moneyElement.innerHTML = getTimeMoneyValue(timeInput.innerHTML);
      moneyElement.id = 'tracker-value-span';
      // TODO: Position moneyElement centered
      
      // Create an observer instance linked to the callback function
      new MutationObserver(updateTrackerValue).observe(timeParent, {subtree: true, characterData: true});
  
      // Prepend element to parent component
      timeParent.prepend(moneyElement);
    }
  }
}

function init() {
  // Insert timer value element and attatch observer
  modifyTimer();

  // Insert a value element and attatch an observer for each time entry
  modifyEntries();
}

// Wait for post-load page modification before getting elements
setTimeout(init, 2000);


// document.addEventListener('DOMContentLoaded', init);