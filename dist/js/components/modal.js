import ContentEditable from 'react-contenteditable';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { Button, Modal, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextControl from './text-control';
import SelectControl from './select-control';
import PluginAttribution from './plugin-attribution';
import { formatAttribution } from '../utils/format';
import help from '../utils/help';

/**
 * React depdendencies
 */
import ReactModal from 'react-modal-resizable-draggable';

const licenses = window.attrLicenses || [];

class AttributionModal extends Component {
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.discardChanges = this.discardChanges.bind( this );

		this.state = {
			editedContent: false,
			adaptedTitle: '',
			adaptedAuthor: '',
			adaptedLicense: '',
			content: '',
			...props.item,
		};
	}

	handleChange( event ) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState( {
			[ name ]: value,
		} );
	}

	handleSubmit( event ) {
		event.preventDefault();

		// Handle updating or adding item.
		if ( this.props.modalType === 'add' ) {
			this.props.addItem( { ...this.state } );
		} else {
			this.props.updateItem( { ...this.state } );
		}

		this.props.onClose();

		// Reset state.
		this.setState( this.props.item );
	}

	discardChanges() {
		this.setState( {
			editedContent: false,
			content: '',
		} );
	}

	render() {
		const blockEditorArea = document.getElementsByClassName( 'edit-post-visual-editor__content-area' );
		const blockEditorHeader = document.getElementsByClassName( 'interface-interface-skeleton__header' );
		const blockEditorSidebar = document.getElementsByClassName( 'interface-interface-skeleton__sidebar' );
		const blockEditorMenu = document.getElementById( 'adminmenumain' );

		if ( ! this.props.isOpen ) {
			if ( blockEditorArea.length > 0 ) {
				blockEditorArea[ 0 ].style.overflow = null;
			}
			if ( blockEditorHeader.length > 0 ) {
				blockEditorHeader[ 0 ].style.zIndex = '90';
			}
			if ( blockEditorSidebar.length > 0 ) {
				blockEditorSidebar[ 0 ].style.zIndex = '90';
			}
			if ( blockEditorMenu ) {
				blockEditorMenu.style.zIndex = null;
				blockEditorMenu.style.position = null;
			}

			return null;
		}

		if ( blockEditorArea.length > 0 ) {
			blockEditorArea[ 0 ].style.overflow = 'hidden';
		}
		if ( blockEditorHeader.length > 0 ) {
			blockEditorHeader[ 0 ].style.zIndex = '10';
		}
		if ( blockEditorSidebar.length > 0 ) {
			blockEditorSidebar[ 0 ].style.zIndex = '10';
		}
		if ( blockEditorMenu ) {
			blockEditorMenu.style.zIndex = '0';
			blockEditorMenu.style.position = 'relative';
		}

		const { onClose, modalType } = this.props;

		const title =
			modalType === 'add' ? __( 'Add Attribution', 'openlab-attributions' ) : __( 'Update Attribution', 'openlab-attributions' );

		const isEdited = this.state.editedContent || this.state.content;
		const preview = formatAttribution( { ...this.state } );

		return (
			<ReactModal
				initWidth={ 600 }
				initHeight={ 460 }
				left="50%"
				minWidth={ 340 }
				minHeight={ 460 }
				disableResize="true"
				className={ 'component-attributions-modal' }
				onRequestClose={ onClose }
				isOpen={ this.props.isOpen }
			>
				<div className="header">
					<h3>{ title }</h3>
					<button onClick={ onClose }>
						<svg
							width="24"
							height="24"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							role="img"
							aria-hidden="true"
							focusable="false"
						>
							<path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path>
						</svg>
					</button>
				</div>
				<div className={ 'body body-' + modalType }>
					<form onSubmit={ this.handleSubmit }>
						<div className="form-row">
							<div className="col">
								<p><strong>{ __( 'Title', 'openlab-attributions' ) }</strong></p>
								<TextControl
									label={ __( 'Title', 'openlab-attributions' ) }
									id="title"
									name="title"
									value={ this.state.title }
									help={ help.title }
									onChange={ this.handleChange }
									placeholder={ __( 'Item Title', 'openlab-attributions' ) }
									required={ !! this.state.titleUrl }
								/>
								<TextControl
									label={ __( 'URL', 'openlab-attributions' ) }
									id="titleUrl"
									name="titleUrl"
									value={ this.state.titleUrl }
									onChange={ this.handleChange }
									placeholder={ __( 'URL of the item', 'openlab-attributions' ) }
									isInline
								/>
							</div>
							<div className="col">
								<p><strong>{ __( 'License', 'openlab-attributions' ) }</strong></p>
								<SelectControl
									label={ __( 'License', 'openlab-attributions' ) }
									id="license"
									name="license"
									value={ this.state.license }
									help={ help.license }
									options={ licenses }
									onChange={ this.handleChange }
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="col mb15">
								<p><strong>{ __( 'Author', 'openlab-attributions' ) }</strong></p>
								<TextControl
									label={ __( 'Author Name', 'openlab-attributions' ) }
									id="authorName"
									name="authorName"
									value={ this.state.authorName }
									help={ help.authorName }
									onChange={ this.handleChange }
									placeholder={ __( 'Author Name', 'openlab-attributions' ) }
									required={ !! this.state.authorUrl }
								/>
								<TextControl
									label={ __( 'URL', 'openlab-attributions' ) }
									id="authorUrl"
									name="authorUrl"
									value={ this.state.authorUrl }
									onChange={ this.handleChange }
									placeholder={ __( 'URL of the author', 'openlab-attributions' ) }
									isInline
								/>
							</div>
							<div className="col adapted-from mb15">
								<p><strong>{ __( 'Adapted From', 'openlab-attributions' ) }</strong></p>
								<TextControl
									label={ __( 'URL', 'openlab-attributions' ) }
									id="derivative"
									name="derivative"
									value={ this.state.derivative }
									help={ help.derivative }
									onChange={ this.handleChange }
									placeholder={ __( 'URL of original work', 'openlab-attributions' ) }
								/>
								<TextControl
									label={ __( 'Title', 'openlab-attributions' ) }
									id="adaptedTitle"
									name="adaptedTitle"
									value={ this.state.adaptedTitle }
									onChange={ this.handleChange }
									placeholder={ __( 'Item Title', 'openlab-attributions' ) }
									required={ !! this.state.derivative }
									isInline
								/>
								<TextControl
									label={ __( 'Author', 'openlab-attributions' ) }
									id="adaptedAuthor"
									name="adaptedAuthor"
									value={ this.state.adaptedAuthor }
									onChange={ this.handleChange }
									placeholder={ __( 'Author Name', 'openlab-attributions' ) }
									isInline
								/>
								<SelectControl
									label={ __( 'License', 'openlab-attributions' ) }
									id="adaptedLicense"
									name="adaptedLicense"
									value={ this.state.adaptedLicense }
									options={ licenses }
									onChange={ this.handleChange }
									required={
										!! this.state.derivative ||
										this.state.adaptedTitle
									}
									isInline
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="col">
								<p><strong>{ __( 'Organization / Publisher', 'openlab-attributions' ) }</strong></p>
								<TextControl
									label={ __( 'Organization / Publisher', 'openlab-attributions' ) }
									id="publisher"
									name="publisher"
									value={ this.state.publisher }
									help={ help.publisher }
									onChange={ this.handleChange }
									placeholder={ __( 'Name of organization or publisher', 'openlab-attributions' ) }
									required={ !! this.state.publisherUrl }
								/>
								<TextControl
									label={ __( 'URL', 'openlab-attributions' ) }
									id="publisherUrl"
									name="publisherUrl"
									value={ this.state.publisherUrl }
									onChange={ this.handleChange }
									placeholder={ __( 'URL of the organization or publisher', 'openlab-attributions' ) }
									isInline
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="col">
								<p><strong>{ __( 'Project', 'openlab-attributions' ) }</strong></p>
								<TextControl
									label={ __( 'Project Name', 'openlab-attributions' ) }
									id="project"
									name="project"
									value={ this.state.project }
									help={ help.project }
									onChange={ this.handleChange }
									placeholder={ __( 'Name of project', 'openlab-attributions' ) }
									required={ !! this.state.projectUrl }
								/>
								<TextControl
									label={ __( 'URL', 'openlab-attributions' ) }
									id="projectUrl"
									name="projectUrl"
									value={ this.state.projectUrl }
									onChange={ this.handleChange }
									placeholder={ __( 'URL of the project', 'openlab-attributions' ) }
									isInline
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="col">
								<p><strong>{ __( 'Date', 'openlab-attributions' ) }</strong></p>
								<TextControl
									label={ __( 'Date Published', 'openlab-attributions' ) }
									id="datePublished"
									name="datePublished"
									value={ this.state.datePublished }
									help={ help.datePublished }
									onChange={ this.handleChange }
									placeholder={ __( 'Date item was published', 'openlab-attributions' ) }
								/>
							</div>
						</div>

						<span className="attribution-preview__title">
							Attribution Preview
						</span>
						<ContentEditable
							className="attribution-preview__body"
							tagName="div"
							html={ isEdited ? this.state.content : preview }
							onChange={ ( event ) => {
								this.setState( {
									editedContent: true,
									content: event.target.value,
								} );
							} }
						/>
						{ isEdited && (
							<Notice
								className="attribution-preview__notice"
								status="warning"
								isDismissible={ false }
							>
								{ __( 'You have edited this text. You can no longer make changes using the fields above. All additional changes must be made manually.', 'openlab-attributions' ) }
								<Button isLink onClick={ this.discardChanges }>
									{ __( 'Discard changes and revert to suggested attribution.', 'openlab-attributions' ) }
								</Button>
							</Notice>
						) }
						<div className="component-modal__footer">
							<Button isDestructive isLink onClick={ onClose }>
								{ __( 'Cancel', 'openlab-attributions' ) }
							</Button>
							<Button isPrimary type="submit">
								{ title }
							</Button>
						</div>
						<PluginAttribution />
					</form>
				</div>
			</ReactModal>
		);
	}
}

export default AttributionModal;
