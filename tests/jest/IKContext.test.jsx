import React from 'react'
import { mount } from 'enzyme';
import IKImage from '../../src/components/IKImage';
import IKUpload from '../../src/components/IKUpload';
import IKContext from '../../src/components/IKContext';

const authenticationEndpoint = 'test_auth_endpoint';
const relativePath = 'default-image.jpg';
const publicKey = 'test_public_key';
const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';

const absolutePath = `${urlEndpoint}/${relativePath}`;
const differentImageRelativePath = 'different-image.jpg';
const differentAbsolutePath = `${urlEndpoint}/${differentImageRelativePath}`;
const differentUrlEndpoint = 'http://ik.imagekit.io/different_imagekit_id';

const trArr = [{height : 300, width : 300}];

describe('IKContext', () => {
  describe('Snapshots', () => {
    test('should work with only urlEndpoint', () => {
      const ikContext = mount(
        <IKContext urlEndpoint={urlEndpoint} >
          <IKImage path={relativePath} transformation={[{
            height: 300,
            width: 400
          }]} />
        </IKContext>
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.x.x">

      const transformURL = `${urlEndpoint}/tr:h-300,w-400/${relativePath}?${global.SDK_VERSION}`;
      expect(ikContext.find('img').prop('src')).toEqual(transformURL);
    });

    test('should work with publicKey and urlEndpoint', () => {
      const ikContext = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
          <IKImage path={relativePath} transformation={[{
            height: 300,
            width: 400
          }]} />
        </IKContext>
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.x.x">

      const transformURL = `${urlEndpoint}/tr:h-300,w-400/${relativePath}?${global.SDK_VERSION}`;
      expect(ikContext.find('img').prop('src')).toEqual(transformURL);
      // public key is found via context in the child component
      expect(ikContext.find('IKImage').instance().getContext().publicKey).toEqual(publicKey);
    });

    test('should work with publicKey, urlEndpoint and authenticationEndpoint', () => {
      const ikContext = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload onError={() => { }} onSuccess={() => { }} />
        </IKContext>
      );
      // '<input type="file">'
      expect(ikContext.html()).toEqual('<input type="file">');
      const childContext = ikContext.find('IKUpload').instance().getContext();
      // all props are found via context in the child component
      expect(childContext.publicKey).toEqual(publicKey);
      expect(childContext.urlEndpoint).toEqual(urlEndpoint);
      expect(childContext.authenticationEndpoint).toEqual(authenticationEndpoint);
    });

    test('should allow override of own urlEndpoint', () => {
      const ikContext = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
          <IKImage path={relativePath} urlEndpoint='https://www.custom-domain.com/' transformation={[{
            height: 300,
            width: 400
          }]} />
        </IKContext>
      );
      // <img alt="" src="https://www.custom-domain.com/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.x.x">

      const transformURL = 'https://www.custom-domain.com/tr:h-300,w-400/default-image.jpg';
      expect(ikContext.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
    });
  });

  describe('props update', () => {
	test('change urlEndpoint in IKContext props and childContext urlEndpoint and image src should change accordingly', () => {
		const ikContext = mount(
		  <IKContext urlEndpoint={urlEndpoint} >
			<IKImage path={relativePath} />
		  </IKContext>
		);

		ikContext.setProps({ urlEndpoint: differentUrlEndpoint });

		expect(ikContext.props().urlEndpoint).toEqual(differentUrlEndpoint);
		ikContext.update();
		const childContext = ikContext.find('IKImage').instance().getContext();
		expect(childContext.urlEndpoint).toEqual(differentUrlEndpoint);

		expect(ikContext.find('img').prop('src')).toEqual(`${differentUrlEndpoint}/${relativePath}?${global.SDK_VERSION}`);
	});
	
	test('change path in IKContext props and childContext path and image src should change accordingly', () => {
		const ikContext = mount(
		  <IKContext urlEndpoint={urlEndpoint} path={relativePath} >
			<IKImage />
		  </IKContext>
		);

		ikContext.setProps({ path: differentImageRelativePath });

		expect(ikContext.props().path).toEqual(differentImageRelativePath);
		ikContext.update();
		const childContext = ikContext.find('IKImage').instance().getContext();
		expect(childContext.path).toEqual(differentImageRelativePath);

		expect(ikContext.find('img').prop('src')).toEqual(`${urlEndpoint}/${differentImageRelativePath}?${global.SDK_VERSION}`);
	});

	test('change src in IKContext props and childContext src and image src should change accordingly', () => {
		const ikContext = mount(
		  <IKContext urlEndpoint={urlEndpoint} src={absolutePath} >
			<IKImage />
		  </IKContext>
		);

		ikContext.setProps({ src: differentAbsolutePath });

		expect(ikContext.props().src).toEqual(differentAbsolutePath);
		ikContext.update();
		const childContext = ikContext.find('IKImage').instance().getContext();
		expect(childContext.src).toEqual(differentAbsolutePath);

		expect(ikContext.find('img').prop('src')).toEqual(`${differentAbsolutePath}?${global.SDK_VERSION}`);
	});

	test('change transformation in IKContext props and childContext transformation and image src should change accordingly', () => {
		const ikContext = mount(
		  <IKContext urlEndpoint={urlEndpoint} >
			<IKImage path={relativePath} />
		  </IKContext>
		);

		ikContext.setProps({ transformation: trArr });

		expect(ikContext.props().transformation).toEqual(trArr);
		ikContext.update();
		const childContext = ikContext.find('IKImage').instance().getContext();
		expect(childContext.transformation).toEqual(trArr);

		expect(ikContext.find('img').prop('src')).toEqual(`${urlEndpoint}/tr:h-300,w-300/${relativePath}?${global.SDK_VERSION}`);
	});

	test('change transformationPosition in IKContext props and childContext transformationPosition and image src should change accordingly', () => {
		const ikContext = mount(
		  <IKContext urlEndpoint={urlEndpoint} >
			<IKImage path={relativePath} transformation={trArr} />
		  </IKContext>
		);

		ikContext.setProps({ transformationPosition: "query" });

		expect(ikContext.props().transformationPosition).toEqual("query");
		ikContext.update();
		const childContext = ikContext.find('IKImage').instance().getContext();
		expect(childContext.transformationPosition).toEqual("query");

		expect(ikContext.find('img').prop('src')).toEqual(`${urlEndpoint}/${relativePath}?${global.SDK_VERSION}&tr=h-300%2Cw-300`);
	});

	test('change queryParameters in IKContext props and childContext queryParameters and image src should change accordingly', () => {
		const ikContext = mount(
		  <IKContext urlEndpoint={urlEndpoint} >
			<IKImage path={relativePath} />
		  </IKContext>
		);

		ikContext.setProps({ queryParameters: {"v" : "1"} });

		expect(ikContext.props().queryParameters).toEqual({"v" : "1"});
		ikContext.update();
		const childContext = ikContext.find('IKImage').instance().getContext();
		expect(childContext.queryParameters).toEqual({"v" : "1"});

		expect(ikContext.find('img').prop('src')).toEqual(`${urlEndpoint}/${relativePath}?${global.SDK_VERSION}&v=1`);
	});
  })
});
