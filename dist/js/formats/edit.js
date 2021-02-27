/**
 * External dependencies
 */
const nanoid = require( 'nanoid' );

/**
 * WordPress dependencies
 */
import { compose, withState } from '@wordpress/compose';
import { dispatch, withSelect } from '@wordpress/data';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { isCollapsed, insertObject } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import icon from './icon';
import Modal from '../components/modal';

const addMarker = ( value, data ) => {
	const id = nanoid( 8 );
	const item = { ...data, id };
	const format = {
		type: 'ol/attributions',
		attributes: {
			href: `#ref-${ id }`,
			id: `anchor-${ id }`,
		},
	};

	// Add attribution.
	dispatch( 'openlab/attributions' ).add( item );

	const startIndex = isCollapsed( value ) ? value.start : value.end;
	const newValue = insertObject( value, format, startIndex );

	return newValue;
};

function Edit( { item, value, isActive, isOpen, setState, onChange } ) {
	return (
		<>
			<RichTextToolbarButton
				icon={ icon }
				name="text-color"
				title="Add Attribution"
				onClick={ () => setState( { isOpen: true } ) }
				isActive={ isActive }
			/>
			{ isOpen && (
				<Modal
					isOpen={ isOpen }
					modalType="add"
					title="Add Attribution"
					item={ item }
					onClose={ () => setState( { isOpen: false } ) }
					addItem={ ( data ) => onChange( addMarker( value, data ) ) }
				/>
			) }
		</>
	);
}

export default compose( [
	withState( { isOpen: false } ),
	withSelect( ( select ) => {
		const { item } = select( 'openlab/modal' ).get();

		return { item };
	} ),
] )( Edit );
