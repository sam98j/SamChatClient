import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLogo from './index';

test('renders AppLogo component', () => {
	render(<AppLogo />);
	const logoElement = screen.getByAltText(/app logo/i);
	expect(logoElement).toBeInTheDocument();
});