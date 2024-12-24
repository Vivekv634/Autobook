'use client';
import ExportAllNotebooks from '@/app/components/ExportAllNotebooks';
import ExportAllNotes from '@/app/components/ExportAllNotes';
import ImportNotesDialog from '@/app/components/ImportNotesDialog';
import { useCustomToast } from '@/app/components/SendToast';
import fontClassifier from '@/app/utils/font-classifier';
import { fonts, pages, themes } from '@/app/utils/pageData';
import { colorizer } from '@/app/utils/selectColorizer';
import setTheme from '@/app/utils/theme';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Check, Download, FileDown, Home, Palette, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SettingsComponent = () => {
  const { user } = useSelector((state) => state.note);
  const [userFont, setUserFont] = useState();
  const [userTheme, setUserTheme] = useState();
  const [homePage, setUserHomePage] = useState();
  const [interval, setTrashInterval] = useState();
  const [importNotes, setImportNotes] = useState(false);
  const [exportallnotes, setExportAllNotes] = useState(false);
  const [exportallnotebooks, setExportAllNotebooks] = useState(false);
  const [themeLoading, setThemeLoading] = useState(false);
  const [fontLoading, setFontLoading] = useState(false);
  const toast = useCustomToast();

  useEffect(() => {
    if (user && user.userData) {
      setUserFont(user.userData.font);
      setUserTheme(user.userData.theme);
      setUserHomePage(user.userData.defaultHomePage);
      setTrashInterval(user.userData.trashInterval);
    }
  }, [user]);

  const handleThemeChange = async () => {
    try {
      setThemeLoading(true);
      const body = { theme: userTheme };
      await axios.put(
        `${process.env.API}/api/account/update/${user.userID}`,
        body,
      );
      setThemeLoading(false);
      toast({
        description: 'Theme updated!',
        color: userTheme,
      });
    } catch (error) {
      console.error(error);
      setThemeLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };

  const handleFontChange = async () => {
    try {
      setFontLoading(true);
      const body = { font: userFont };
      await axios.put(
        `${process.env.API}/api/account/update/${user.userID}`,
        body,
      );
      setFontLoading(false);
      toast({
        description: 'Font updated!',
        color: userTheme,
      });
    } catch (error) {
      console.error(error);
      setFontLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };

  const handleDefaultHomePageChange = async (page) => {
    await axios.put(`${process.env.API}/api/account/update/${user.userID}`, {
      defaultHomePage: page,
    });
    toast({
      description: 'Default home page updated!',
      color: user?.userData?.theme,
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
      color: user?.userData?.theme,
    });
  };

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Theme</label>
            <div className="flex gap-2">
              <Select
                value={userTheme}
                onValueChange={(e) => {
                  setUserTheme(e);
                  setTheme(e);
                }}
                className="flex-1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className={fontClassifier(user?.userData?.font)}>
                  {Object.keys(themes).map((theme) => {
                    let color = colorizer(theme);
                    return (
                      <SelectItem
                        className={cn(color)}
                        value={theme}
                        key={theme}
                      >
                        {theme[0].toUpperCase() + theme.slice(1)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                className={cn(user?.userData?.theme === userTheme && 'hidden')}
                onClick={handleThemeChange}
                disabled={themeLoading}
                size="icon"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Font</label>
            <div className="flex gap-2">
              <Select
                value={userFont}
                onValueChange={(e) => {
                  setUserFont(e);
                  document.body.style.fontFamily = e;
                }}
                className="flex-1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className={fontClassifier(user?.userData?.font)}>
                  {Object.keys(fonts).map((font) => {
                    return (
                      <SelectItem value={font} key={font}>
                        {fonts[font]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                className={cn(user?.userData?.font === userFont && 'hidden')}
                onClick={handleFontChange}
                disabled={fontLoading}
                size="icon"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Behaviour
          </CardTitle>
          <CardDescription>
            Configure how the application behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Home Page</label>
            <div className="flex gap-2">
              <Select
                value={homePage}
                onValueChange={(e) => {
                  handleDefaultHomePageChange(e);
                }}
                className="flex-1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default page" />
                </SelectTrigger>
                <SelectContent className={fontClassifier(user?.userData?.font)}>
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
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cleanup Interval</label>
            <div className="flex gap-2">
              <Select
                value={interval || 'never'}
                onValueChange={(e) => {
                  handleDeletionIntervalChange(e);
                }}
                className="flex-1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cleanup interval" />
                </SelectTrigger>
                <SelectContent className={fontClassifier(user?.userData?.font)}>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              All the trash notes will be deleted permanently after this
              interval.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export and import your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Export</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setExportAllNotes(true)}
              >
                <Download className="w-4 h-4" />
                Export Notes
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setExportAllNotebooks(true)}
              >
                <Download className="w-4 h-4" />
                Export Notebooks
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Import</h4>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setImportNotes(true)}
            >
              <Upload className="w-4 h-4" />
              Import Notes
            </Button>
          </div>
        </CardContent>
      </Card>
      <ImportNotesDialog open={importNotes} setOpen={setImportNotes} />
      <ExportAllNotes open={exportallnotes} setOpen={setExportAllNotes} />
      <ExportAllNotebooks
        open={exportallnotebooks}
        setOpen={setExportAllNotebooks}
      />
    </div>
  );
};

export default SettingsComponent;
