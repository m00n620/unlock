import { Link } from '../../helpers/Link'
import { Popover, Transition, Disclosure } from '@headlessui/react'
import { Button } from '@unlock-protocol/ui'
import React, { Fragment } from 'react'
import { MdFormatListBulleted as BulletedListIcon } from 'react-icons/md'
import { FaGithub as GithubIcon } from 'react-icons/fa'
import { FiLifeBuoy as LifeBuoyIcon, FiCode as CodeIcon } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { UnlockTextIcon } from '../../icons'
import { FilesIcon } from '../../icons/Util'
import {
  AiOutlineDown as DownIcon,
  AiOutlineUp as UpIcon,
} from 'react-icons/ai'
import { HiX as XIcon, HiMenu as MenuIcon } from 'react-icons/hi'
import { unlockConfig } from '../../../config/unlock'
interface NavigationLink {
  name: string
  href: string
}

interface NavigationalLinkWithIcon extends NavigationLink {
  Icon: IconType
}

const DEVELOPER_NAVIGATION_INTEGRATIONS: NavigationLink[] = [
  {
    name: 'WordPress',
    href: 'https://docs.unlock-protocol.com/unlock/creators/plugins-and-integrations/wordpress-plugin',
  },
  {
    name: 'Webflow',
    href: '/blog/webflow-integration',
  },
  {
    name: 'Discord',
    href: 'https://docs.unlock-protocol.com/unlock/creators/plugins-and-integrations/discord',
  },
  {
    name: 'Shopify',
    href: 'https://github.com/pwagner/unlock-shopify-app',
  },
  {
    name: 'Discourse',
    href: 'https://unlock.community/t/unlock-discourse-plugin/64',
  },
]

const DEVELOPER_NAVIGATION_RECIPES: NavigationLink[] = [
  {
    name: 'Making a custom login',
    href: 'https://docs.unlock-protocol.com/unlock/developers/sign-in-with-ethereum',
  },
  {
    name: 'Webhooks',
    href: 'https://docs.unlock-protocol.com/unlock/developers/locksmith/webhooks',
  },
  {
    name: 'Create your own API',
    href: 'https://docs.unlock-protocol.com/unlock/developers/unlock-platform',
  },
  {
    name: 'Manage Contracts',
    href: 'https://docs.unlock-protocol.com/unlock/developers/smart-contracts',
  },
]

const DEVELOPER_NAVIGATION_BOTTOM_ITEMS: NavigationalLinkWithIcon[] = [
  {
    name: 'API Reference',
    Icon: BulletedListIcon,
    href: 'https://docs.unlock-protocol.com/unlock/developers/unlock-platform',
  },
  {
    name: 'Github',
    Icon: GithubIcon,
    href: 'https://github.com/unlock-protocol/unlock',
  },
  {
    name: 'Support',
    Icon: LifeBuoyIcon,
    href: 'mailto:hello@unlock-protocol.com?subject=Hello%2C%20I%20want%20help%20with',
  },
  {
    name: 'Roadmap',
    Icon: CodeIcon,
    href: 'https://docs.unlock-protocol.com/unlock/governance/roadmap',
  },
]

function DeveloperPopover() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`hover:text-brand-dark flex items-center gap-2 ${
              open ? 'text-black' : 'text-brand-gray'
            }`}
          >
            Devs {open ? <UpIcon size={12} /> : <DownIcon size={12} />}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute w-screen max-w-xl px-4 mt-3 transform -translate-x-1/2 z-100 left-1/2">
              <div className="glass-pane rounded-3xl">
                <div className="grid p-4">
                  <header className="flex pb-6 gap-x-4 items-base">
                    <div>
                      <FilesIcon className="not-sr-only" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Link href="https://docs.unlock-protocol.com/unlock/">
                        <p className="text-sm font-bold"> Documentation </p>
                      </Link>
                      <p className="text-sm text-brand-gray">
                        Your starting point for the integration of Unlock into
                        other platforms
                      </p>
                    </div>
                  </header>
                  <div className="flex justify-between max-w-[400px] pl-8">
                    <div>
                      <Link href="https://docs.unlock-protocol.com/unlock/creators/plugins-and-integrations">
                        <p className="text-xs font-bold uppercase ">
                          Integrations
                        </p>
                      </Link>

                      <nav className="grid gap-1 pt-2">
                        {DEVELOPER_NAVIGATION_INTEGRATIONS.map(
                          (item, index) => (
                            <Link
                              className="text-sm text-brand-gray hover:text-brand-dark"
                              key={index}
                              href={item.href}
                            >
                              {item.name}
                            </Link>
                          )
                        )}
                      </nav>
                    </div>
                    <div>
                      <Link href="https://docs.unlock-protocol.com/unlock/developers/tutorials">
                        <p className="text-xs font-bold uppercase ">Recipes</p>
                      </Link>
                      <nav className="grid gap-1 pt-2">
                        {DEVELOPER_NAVIGATION_RECIPES.map((item, index) => (
                          <Link
                            className="text-sm text-brand-gray hover:text-brand-dark"
                            key={index}
                            href={item.href}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-2 gap-1 p-4 bg-white rounded-3xl">
                    {DEVELOPER_NAVIGATION_BOTTOM_ITEMS.map(
                      ({ name, href, Icon }, index) => (
                        <Link
                          href={href}
                          key={index}
                          className="flex gap-2 p-2 text-sm font-medium rounded-xl hover:bg-slate-50"
                        >
                          <Icon className="text-lg not-sr-only text-brand-ui-primary" />
                          {name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

function Desktop() {
  const link = 'text-brand-gray hover:text-black'
  return (
    <div className="items-center hidden gap-12 sm:flex">
      <DeveloperPopover />
      <Link
        className={link}
        href="https://docs.unlock-protocol.com/unlock/creators/faq"
      >
        Creators
      </Link>
      <Link className={link} href="/about">
        About
      </Link>
      <Button href={unlockConfig.appURL} variant="outlined-primary" as={Link}>
        Dashboard
      </Button>
    </div>
  )
}

function Mobile() {
  return (
    <div className="relative flex justify-center w-full">
      <Disclosure.Panel className="absolute w-full max-w-lg px-4 space-y-1 sm:hidden">
        <div className="space-y-2 glass-pane rounded-xl">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full p-4 font-medium bg-white shadow-lg rounded-xl">
                  For Devs {open ? <UpIcon /> : <DownIcon />}{' '}
                </Disclosure.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-125"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Disclosure.Panel>
                    <div className="p-6 space-y-4">
                      <div>
                        <Link href="https://docs.unlock-protocol.com/unlock/creators/plugins-and-integrations">
                          <p className="text-xs font-bold uppercase ">
                            Integrations
                          </p>
                        </Link>

                        <nav className="grid gap-2 pt-2">
                          {DEVELOPER_NAVIGATION_INTEGRATIONS.map(
                            (item, index) => (
                              <Link
                                className="text-sm text-brand-gray hover:text-brand-dark"
                                key={index}
                                href={item.href}
                              >
                                {item.name}
                              </Link>
                            )
                          )}
                        </nav>
                      </div>
                      <div>
                        <Link href="https://docs.unlock-protocol.com/unlock/developers/tutorials">
                          <p className="text-xs font-bold uppercase ">
                            Recipes
                          </p>
                        </Link>
                        <nav className="grid gap-2 pt-2">
                          {DEVELOPER_NAVIGATION_RECIPES.map((item, index) => (
                            <Link
                              className="text-sm text-brand-gray hover:text-brand-dark"
                              key={index}
                              href={item.href}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <div className="p-4 m-2 space-y-2 bg-white rounded-3xl">
                      {DEVELOPER_NAVIGATION_BOTTOM_ITEMS.map(
                        ({ name, href, Icon }, index) => (
                          <Link
                            href={href}
                            key={index}
                            className="flex gap-2 p-2 text-sm font-medium rounded-xl hover:bg-slate-50"
                          >
                            <Icon className="text-lg not-sr-only text-brand-ui-primary" />
                            {name}
                          </Link>
                        )
                      )}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
          <div className="flex flex-col gap-4 p-4 bg-white rounded-xl">
            <Link href="https://docs.unlock-protocol.com/unlock/creators/faq">
              Creators
            </Link>
            <Link href="/about"> About us </Link>
            <Button as={Link} href={unlockConfig.appURL}>
              Dashboard
            </Button>
          </div>
        </div>
      </Disclosure.Panel>
    </div>
  )
}

export function Navigation() {
  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-10 w-full py-4 sm:px-6 bg-brand-primary"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between px-6 sm:px-0">
              <Link href="/">
                <UnlockTextIcon />
              </Link>
              <div className="sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon
                      className="block w-6 h-6 fill-brand-ui-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <Desktop />
            </div>
          </div>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-175"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Mobile />
          </Transition>
        </>
      )}
    </Disclosure>
  )
}