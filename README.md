# react-remote-data-hooks

> Remote data management hooks. Load data using hooks and perfom a remote action using hooks

[![NPM](https://img.shields.io/npm/v/react-remote-data-hooks.svg)](https://www.npmjs.com/package/react-remote-data-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-remote-data-hooks
```

## Usage

- `useDataLoader`

```tsx
import React, from 'react'

import { useDataLoader } from 'react-remote-data-hooks'

const Example = props => {
  const { data, loaded, loading, error, reload } = useDataLoader<MyDataType>(loadDataFromAnywhere);

  if(!loaded || loading) {
    return loader; // Shw your loader here
  }

  if(error){
    return renderError(); // render your error message here;
  }

  return <AnyComponent data={data} onReload={reload} /> // passing the loaded data here, calling reload will reload the content
}
```

- `usePerformAction`

```tsx
import React, from 'react'

import { usePerformAction } from 'react-remote-data-hooks'

const Example = props => {
  const { isPerforming, performAction, error } = usePerformAction(myAction, onSuccess, onError); // onSuccess and onError are optional

  if(isPerforming) {
    return loader; // Shw your loader here
  }

  if(error){
    return renderError(); // render your error message here;
  }

  return <button onClick={performAction} disabled={isPerforming} /> // passing the loaded data here
}
```

## License

MIT © [skkallayath](https://github.com/skkallayath)
