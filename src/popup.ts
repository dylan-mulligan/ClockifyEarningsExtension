'use strict';

import './popup.css';

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: (cb: (arg0: any) => void) => {
      chrome.storage.sync.get(['count'], result => {
        cb(result.count);
      });
    },
    set: (value: any, cb: () => void) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue = 0) {
    const counter: HTMLElement | null = document.getElementById('counter');
    if(counter === null) return;
    counter.innerHTML = initialValue.toString();

    const incBtn: HTMLElement | null = document.getElementById('incrementBtn');
    if(incBtn === null) return;
    incBtn.addEventListener('click', () => {
      updateCounter('INCREMENT');
    });

    const decBtn: HTMLElement | null = document.getElementById('decrementBtn');
    if(decBtn === null) return;
    decBtn.addEventListener('click', () => {
      updateCounter('DECREMENT');
    });
  }

  function updateCounter(type: 'INCREMENT' | 'DECREMENT') {
    counterStorage.get(count => {
      let newCount: number;

      if (type === 'INCREMENT') {
        newCount = count + 1;
      } else if (type === 'DECREMENT') {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        const counter: HTMLElement | null = document.getElementById('counter');
        if(counter === null) return;
        counter.innerHTML = newCount.toString();

        // Communicate with content script of
        // active tab by sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tab = tabs[0];

          chrome.tabs.sendMessage(
            tab.id !== undefined ? tab.id : 0,
            {
              type: 'COUNT',
              payload: {
                count: newCount,
              },
            },
            response => {
              console.log('Current count value passed to contentScript file');
            }
          );
        });
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    counterStorage.get(count => {
      if (typeof count === 'undefined') {
        // Set counter value as 0
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );
})();
