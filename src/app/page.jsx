import { MainHeader, Text, Space, Container, A, MoreExperiments } from 'jbx';

import Img2cssApp from '@/components/Img2cssApp.jsx';

export default function Page() {
  return (
    <Container>
      <MainHeader>img2css</MainHeader>

      <Space h={1} />
      <Text>
        This is a tool that can convert any image into a pure css image.
      </Text>

      <Space h={2} />

      <Img2cssApp />

      <Space h={2} />
      <Text>
        I also made a per-pixel animation experiment using the box-shadow idea,
        see <A href="https://javier.xyz/morphin">morphin</A>.
      </Text>

      <Space h={2} />

      <MoreExperiments exclude="img2css" />

      <Space h={2} />
      <Text>
        Made by <A href="https://twitter.com/javierbyte">javierbyte</A>.
      </Text>
      <Space h={3} />
    </Container>
  );
}
