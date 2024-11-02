'use client';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { pages, themes } from '@/app/utils/pageData';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ImportNotesDialog from '@/app/components/ImportNotesDialog';
import ExportAllNotes from '@/app/components/ExportAllNotes';
import ExportAllNotebooks from '@/app/components/ExportAllNotebooks';
import setTheme from '@/app/utils/theme';
import { useCustomToast } from '@/app/components/SendToast';

const SettingsComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { user } = useSelector((state) => state.note);
  const [userTheme, setUserTheme] = useState(
    user && user.userData && user.userData?.theme,
  );
  const [homePage] = useState(
    user && user.userData && user.userData?.defaultHomePage,
  );
  const [interval] = useState(user?.userData?.trashInterval);
  const [importNotes, setImportNotes] = useState(false);
  const [exportallnotes, setExportAllNotes] = useState(false);
  const [exportallnotebooks, setExportAllNotebooks] = useState(false);
  const toast = useCustomToast();

  const handleThemeChange = async () => {
    const body = { theme: userTheme };
    await axios.put(
      `${process.env.API}/api/account/update/${user.userID}`,
      body,
    );
    toast({
      description: 'Theme updated!',
      color: user.userData.theme,
    });
  };

  const handleDefaultHomePageChange = async (page) => {
    await axios.put(`${process.env.API}/api/account/update/${user.userID}`, {
      defaultHomePage: page,
    });
    toast({
      description: 'Default home page updated!',
      color: user.userData.theme,
    });
  };

  const handleDeletionIntervalChange = async (days) => {
    await axios.put(
      `${process.env.API}/api/update-trash-interval-time`,
      {
        trashInterval: days,
      },
      { headers: { notesDocID: user?.userData?.notesDocID } },
    );
    toast({
      description: 'Trash interval updated!',
      color: user.userData.theme,
    });
  };

  return (
    <section className={cn(isDesktop && 'container')}>
      <div className="p-2 border rounded-md mt-2 mx-1">
        <Label className="text-2xl font-extrabold block">Appearance</Label>
        <Separator className="my-2" />
        <div className="flex justify-between items-start">
          <div>
            <Label className="block font-bold">Default Theme</Label>
            <Label className="text-muted-foreground">
              Set your prefered app theme
            </Label>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Select
              value={userTheme}
              onValueChange={(e) => {
                setUserTheme(e);
                setTheme(e);
              }}
            >
              <SelectTrigger className="w-fit gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(themes).map((theme) => {
                  const color = `text-${theme}-600`;
                  return (
                    <SelectItem className={color} value={theme} key={theme}>
                      {theme.toUpperCase()}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              className={cn(user?.userData?.theme === userTheme && 'hidden')}
              onClick={handleThemeChange}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="p-2 border rounded-md mt-2 mx-1">
        <Label className="text-2xl font-extrabold block">Behaviour</Label>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
          <div>
            <Label className="block font-bold">Home Page</Label>
            <Label className="text-muted-foreground">
              Default home page on app open
            </Label>
          </div>
          <Select
            value={homePage}
            onValueChange={(e) => {
              handleDefaultHomePageChange(e);
            }}
          >
            <SelectTrigger className="w-fit gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" side="top" align="start">
              {pages.map((page) => {
                if (page.label == 'Trash') {
                  return;
                } else {
                  return (
                    <SelectItem key={page.label} value={page.id}>
                      {page.label}
                    </SelectItem>
                  );
                }
              })}
            </SelectContent>
          </Select>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <div>
            <Label className="block font-bold">Cleanup interval</Label>
            <Label className="text-muted-foreground">
              All the trash notes will be deleted permanently after this
              interval.
            </Label>
          </div>
          <Select
            value={interval || 'never'}
            onValueChange={(e) => {
              handleDeletionIntervalChange(e);
            }}
          >
            <SelectTrigger className="w-fit gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="15">15 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-2 border rounded-md mt-2 mx-1">
        <Label className="text-2xl font-extrabold block">Export</Label>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <div>
            <Label className="block font-bold">Export Notes</Label>
            <Label className="text-muted-foreground">Export all notes</Label>
          </div>
          <Button variant="secondary" onClick={() => setExportAllNotes(true)}>
            Export
          </Button>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <div>
            <Label className="block font-bold">Export Notebooks</Label>
            <Label className="text-muted-foreground">
              Export all notebooks and notes
            </Label>
          </div>
          <Button
            variant="secondary"
            onClick={() => setExportAllNotebooks(true)}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="p-2 border rounded-md mt-2 mx-1">
        <Label className="text-2xl font-extrabold block">Import</Label>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <div>
            <Label className="block font-bold">Import Notes</Label>
            <Label className="text-muted-foreground">Import your note(s)</Label>
          </div>
          <Button variant="secondary" onClick={() => setImportNotes(true)}>
            Import
          </Button>
        </div>
      </div>
      <ImportNotesDialog open={importNotes} setOpen={setImportNotes} />
      <ExportAllNotes open={exportallnotes} setOpen={setExportAllNotes} />
      <ExportAllNotebooks
        open={exportallnotebooks}
        setOpen={setExportAllNotebooks}
      />
    </section>
  );
};

export default SettingsComponent;
