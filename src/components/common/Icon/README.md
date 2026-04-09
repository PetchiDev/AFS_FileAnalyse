# Icon Component

A reusable icon component that supports SVG files imported via SVGR.

## Usage

### Import SVG as React Component

```jsx
import ExampleIcon from '@/assets/icons/example-icon.svg?react';
import Icon from '@/components/common/Icon';

const MyComponent = () => {
  return (
    <Icon 
      src={ExampleIcon} 
      alt="Example icon"
      size="medium"
    />
  );
};
```

### Direct Import

```jsx
import ExampleIcon from '@/assets/icons/example-icon.svg?react';

const MyComponent = () => {
  return <ExampleIcon className="my-icon" />;
};
```

### Import as URL (default behavior)

```jsx
import iconUrl from '@/assets/icons/example-icon.svg';

const MyComponent = () => {
  return <img src={iconUrl} alt="Example icon" />;
};
```

## Props

- `src`: SVG React component or URL string (required)
- `alt`: Alternative text for accessibility
- `className`: Additional CSS classes
- `size`: Icon size - 'small' | 'medium' | 'large'

