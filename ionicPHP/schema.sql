-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 89.46.68.60:3306
-- Creato il: Ott 11, 2026 alle 16:17
-- Versione del server: 5.0.96-community-log
-- Versione PHP: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `Sql153576_1`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `alleati`
--

CREATE TABLE `alleati` (
  `idalleato` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `livello` int(11) NOT NULL,
  `nomealleato` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `tipologia` int(11) NOT NULL DEFAULT '77'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `background`
--

CREATE TABLE `background` (
  `idback` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `livello` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `background_main`
--

CREATE TABLE `background_main` (
  `idback` int(11) NOT NULL,
  `nomeback` varchar(20) CHARACTER SET utf8 NOT NULL,
  `tipologia` int(11) NOT NULL DEFAULT '5',
  `MaxIniziale` int(11) NOT NULL,
  `MinIniziale` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `blood`
--

CREATE TABLE `blood` (
  `bloodp` int(11) NOT NULL,
  `maxdisc` int(11) NOT NULL,
  `bonusrigen` int(11) NOT NULL,
  `bonusdisc` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `chanceviolazione`
--

CREATE TABLE `chanceviolazione` (
  `chance` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `clan`
--

CREATE TABLE `clan` (
  `idclan` int(11) NOT NULL,
  `nomeclan` char(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `clanimg` char(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `PNG` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cond_oggetti`
--

CREATE TABLE `cond_oggetti` (
  `idcondizione` int(11) NOT NULL,
  `idoggetto` int(11) NOT NULL,
  `tipocond` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `tabcond` int(11) NOT NULL,
  `valcond` int(11) NOT NULL,
  `descrX` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `risp` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `subskill` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `contatti`
--

CREATE TABLE `contatti` (
  `idcontatto` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `livello` int(11) NOT NULL,
  `nomecontatto` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `tipologia` int(11) NOT NULL DEFAULT '7'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cronaca`
--

CREATE TABLE `cronaca` (
  `IDcronaca` int(11) NOT NULL,
  `Descrizione` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `dadi`
--

CREATE TABLE `dadi` (
  `ID` bigint(20) NOT NULL,
  `idutente` int(11) NOT NULL,
  `nomepg` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `Ora` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Testo` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Destinatario` int(11) NOT NULL DEFAULT '-1',
  `clan` int(11) NOT NULL DEFAULT '-1',
  `cronaca` int(11) NOT NULL DEFAULT '-1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci PACK_KEYS=0;

-- --------------------------------------------------------

--
-- Struttura della tabella `discipline`
--

CREATE TABLE `discipline` (
  `iddisciplina` int(11) NOT NULL DEFAULT '0',
  `idutente` int(11) NOT NULL,
  `livello` smallint(6) NOT NULL,
  `DiClan` char(1) CHARACTER SET utf8 NOT NULL DEFAULT 'S',
  `focus` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `discipline_main`
--

CREATE TABLE `discipline_main` (
  `iddisciplina` int(11) NOT NULL,
  `nomedisc` varchar(35) CHARACTER SET utf8 NOT NULL,
  `tipologia` smallint(6) NOT NULL DEFAULT '2',
  `vili` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `focusattr`
--

CREATE TABLE `focusattr` (
  `nomeattr` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `livelloattr` int(11) NOT NULL,
  `bonus` varchar(1024) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `generazione`
--

CREATE TABLE `generazione` (
  `generazione` int(11) NOT NULL,
  `maxps` int(11) NOT NULL,
  `maxstat` int(11) NOT NULL,
  `bane` int(11) NOT NULL,
  `rigen` int(11) NOT NULL,
  `frenesia` int(11) NOT NULL,
  `cacciaobbligata` int(11) NOT NULL,
  `tempocaccia` int(11) NOT NULL,
  `bol` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `legami`
--

CREATE TABLE `legami` (
  `domitor` int(11) NOT NULL,
  `target` int(11) NOT NULL,
  `livello` int(11) NOT NULL,
  `dataultima` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `lineedisangue`
--

CREATE TABLE `lineedisangue` (
  `idlds` int(11) NOT NULL,
  `idclan` int(11) NOT NULL,
  `nomelds` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fondatorelds` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mentorelds` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pregiolds` varchar(2048) COLLATE utf8_unicode_ci NOT NULL,
  `difettolds` varchar(2048) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `log`
--

CREATE TABLE `log` (
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `log` varchar(1000) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `logpx`
--

CREATE TABLE `logpx` (
  `idutente` int(11) NOT NULL,
  `px` int(11) NOT NULL,
  `Azione` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `logpx_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `logscan`
--

CREATE TABLE `logscan` (
  `IDoggetto` int(11) NOT NULL,
  `IDutente` int(11) NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `logscanfull`
--

CREATE TABLE `logscanfull` (
  `idscan` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `idoggetto` int(11) NOT NULL,
  `motivo` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `descrizione` varchar(1024) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `logscanogg`
--

CREATE TABLE `logscanogg` (
  `idoggetto` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `datascan` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `necromanzie`
--

CREATE TABLE `necromanzie` (
  `idnecro` int(11) NOT NULL,
  `livello` smallint(6) NOT NULL,
  `idutente` int(11) NOT NULL,
  `principale` int(1) NOT NULL,
  `focus` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `necromanzie2`
--

CREATE TABLE `necromanzie2` (
  `idnecro2` int(11) NOT NULL,
  `idnecro` int(11) NOT NULL,
  `livello` int(11) NOT NULL,
  `nomenecro2` varchar(35) COLLATE utf8_unicode_ci NOT NULL,
  `attivo` varchar(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `necromanzie_main`
--

CREATE TABLE `necromanzie_main` (
  `idnecro` int(11) NOT NULL,
  `nomenecro` varchar(255) CHARACTER SET utf8 NOT NULL,
  `tipologia` int(11) NOT NULL DEFAULT '3',
  `clanesclusivo` int(11) NOT NULL DEFAULT '11'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `obiettivi`
--

CREATE TABLE `obiettivi` (
  `idclan` int(11) NOT NULL,
  `IDcronaca` int(11) NOT NULL,
  `linkurl` varchar(128) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `oggetti`
--

CREATE TABLE `oggetti` (
  `idoggetto` int(11) NOT NULL,
  `barcode` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `nomeoggetto` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `descrizione` text COLLATE utf8_unicode_ci NOT NULL,
  `fissomobile` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `ifdomanda` smallint(6) NOT NULL DEFAULT '0',
  `domanda` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `r1` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `r2` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IDcronaca` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `paired`
--

CREATE TABLE `paired` (
  `IDoggetto1` int(11) NOT NULL,
  `IDoggetto2` int(11) NOT NULL,
  `Paired` varchar(1024) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `personaggio`
--

CREATE TABLE `personaggio` (
  `idutente` int(11) NOT NULL,
  `nomeplayer` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `nomepg` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `idclan` int(11) NOT NULL,
  `idlds` int(11) NOT NULL,
  `generazione` int(11) NOT NULL,
  `forza` int(11) NOT NULL,
  `destrezza` int(11) NOT NULL,
  `attutimento` int(11) NOT NULL,
  `carisma` int(11) NOT NULL,
  `persuasione` int(11) NOT NULL,
  `saggezza` int(11) NOT NULL,
  `percezione` int(11) NOT NULL,
  `prontezza` int(11) NOT NULL,
  `intelligenza` int(11) NOT NULL,
  `fdv` int(11) NOT NULL,
  `fdvmax` int(11) NOT NULL,
  `idstatus` int(11) NOT NULL,
  `idsentiero` int(11) NOT NULL,
  `valsentiero` int(11) NOT NULL,
  `fama1` int(11) NOT NULL,
  `fama2` int(11) NOT NULL,
  `fama3` int(11) NOT NULL,
  `xp` int(11) NOT NULL,
  `xps` int(11) NOT NULL,
  `xpspesi` int(11) NOT NULL,
  `bio` text COLLATE utf8_unicode_ci,
  `note` text COLLATE utf8_unicode_ci,
  `lastfdv` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PScorrenti` int(11) NOT NULL,
  `lastps` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `lastcaccia` timestamp NOT NULL DEFAULT '2000-12-31 23:00:00',
  `rifugio` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `zona` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `notemaster` text COLLATE utf8_unicode_ci,
  `bloodp` int(11) NOT NULL,
  `nummaesta` int(11) NOT NULL,
  `lastmaesta` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `contanti` int(11) NOT NULL DEFAULT '0',
  `IDcronaca` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `poteri`
--

CREATE TABLE `poteri` (
  `idpotere` int(11) NOT NULL,
  `idutente` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `poteri_main`
--

CREATE TABLE `poteri_main` (
  `idpotere` int(11) NOT NULL,
  `iddisciplina` int(11) NOT NULL,
  `livellopot` int(11) NOT NULL,
  `nomepotere` varchar(35) COLLATE utf8_unicode_ci NOT NULL,
  `discprereq` int(11) DEFAULT NULL,
  `livdiscprereq` int(11) DEFAULT NULL,
  `attrprereq` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `livattrprereq` int(11) DEFAULT NULL,
  `skillprereq` int(11) DEFAULT NULL,
  `livskillprereq` int(11) DEFAULT NULL,
  `potereprereq` int(11) DEFAULT NULL,
  `attivo` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pregidifetti`
--

CREATE TABLE `pregidifetti` (
  `idpregio` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `pxspesi` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pregidifetti_main`
--

CREATE TABLE `pregidifetti_main` (
  `idpregio` int(11) NOT NULL,
  `nomepregio` varchar(35) CHARACTER SET utf8 NOT NULL,
  `valore` int(11) NOT NULL,
  `tipologia` int(11) NOT NULL DEFAULT '8',
  `classe` varchar(1) COLLATE utf8_unicode_ci NOT NULL,
  `parattr` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parvalore` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prestampa`
--

CREATE TABLE `prestampa` (
  `idoggetto` int(11) NOT NULL,
  `quantita` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `risorse`
--

CREATE TABLE `risorse` (
  `id` int(11) NOT NULL,
  `idutente` int(11) NOT NULL,
  `spesa` int(11) NOT NULL,
  `dataspesa` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cadenzarecupero` int(11) NOT NULL DEFAULT '30'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `rituali_n`
--

CREATE TABLE `rituali_n` (
  `idrituale` int(11) NOT NULL,
  `idutente` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `rituali_n_main`
--

CREATE TABLE `rituali_n_main` (
  `idrituale` int(11) NOT NULL,
  `nomerituale` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `livello` int(11) NOT NULL,
  `tipologia` smallint(6) NOT NULL DEFAULT '11'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `rituali_t`
--

CREATE TABLE `rituali_t` (
  `idrituale` int(11) NOT NULL,
  `idutente` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `rituali_t_main`
--

CREATE TABLE `rituali_t_main` (
  `idrituale` int(11) NOT NULL,
  `nomerituale` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `livello` int(11) NOT NULL,
  `tipologia` smallint(6) NOT NULL DEFAULT '11'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `rubrica`
--

CREATE TABLE `rubrica` (
  `idrubrica` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `contatto` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cell` int(11) NOT NULL,
  `home` int(11) NOT NULL,
  `note` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `segreteria`
--

CREATE TABLE `segreteria` (
  `idutente` int(11) NOT NULL,
  `eventi` int(11) NOT NULL,
  `eventodata` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `saldo` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `sentieri`
--

CREATE TABLE `sentieri` (
  `idsentiero` int(11) NOT NULL,
  `sentiero` varchar(35) CHARACTER SET latin1 NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `skill`
--

CREATE TABLE `skill` (
  `idskill` int(11) NOT NULL,
  `livello` smallint(6) NOT NULL,
  `idutente` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `skill_main`
--

CREATE TABLE `skill_main` (
  `idskill` int(11) NOT NULL,
  `nomeskill` varchar(30) CHARACTER SET utf8 NOT NULL,
  `subskill` int(11) NOT NULL,
  `tipologia` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `statuscama`
--

CREATE TABLE `statuscama` (
  `idstatus` int(11) NOT NULL,
  `status` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `attivazione` int(11) NOT NULL,
  `bgbase` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `taumaturgie`
--

CREATE TABLE `taumaturgie` (
  `idtaum` int(11) NOT NULL,
  `livello` smallint(6) NOT NULL,
  `idutente` int(11) NOT NULL,
  `principale` int(1) NOT NULL,
  `focus` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `taumaturgie2`
--

CREATE TABLE `taumaturgie2` (
  `idtaum2` int(11) NOT NULL,
  `idtaum` int(11) NOT NULL,
  `livello` int(11) NOT NULL,
  `nometaum2` varchar(35) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `taumaturgie_main`
--

CREATE TABLE `taumaturgie_main` (
  `idtaum` int(11) NOT NULL,
  `nometaum` varchar(255) CHARACTER SET utf8 NOT NULL,
  `tipologia` int(11) NOT NULL DEFAULT '3',
  `clanesclusivo` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `idutente` int(11) NOT NULL,
  `nome` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `admin` int(11) NOT NULL,
  `registrationID` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastlogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `alleati`
--
ALTER TABLE `alleati`
  ADD PRIMARY KEY (`idalleato`),
  ADD KEY `idutente` (`idutente`);

--
-- Indici per le tabelle `background`
--
ALTER TABLE `background`
  ADD UNIQUE KEY `idback` (`idback`,`idutente`);

--
-- Indici per le tabelle `background_main`
--
ALTER TABLE `background_main`
  ADD PRIMARY KEY (`idback`);

--
-- Indici per le tabelle `blood`
--
ALTER TABLE `blood`
  ADD UNIQUE KEY `bloodpot` (`bloodp`);

--
-- Indici per le tabelle `clan`
--
ALTER TABLE `clan`
  ADD PRIMARY KEY (`idclan`);

--
-- Indici per le tabelle `cond_oggetti`
--
ALTER TABLE `cond_oggetti`
  ADD PRIMARY KEY (`idcondizione`),
  ADD KEY `idoggetto` (`idoggetto`);

--
-- Indici per le tabelle `contatti`
--
ALTER TABLE `contatti`
  ADD PRIMARY KEY (`idcontatto`),
  ADD KEY `idutente` (`idutente`);

--
-- Indici per le tabelle `cronaca`
--
ALTER TABLE `cronaca`
  ADD UNIQUE KEY `idxcronaca` (`IDcronaca`);

--
-- Indici per le tabelle `dadi`
--
ALTER TABLE `dadi`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `discipline`
--
ALTER TABLE `discipline`
  ADD UNIQUE KEY `IDdisciplina` (`iddisciplina`,`idutente`);

--
-- Indici per le tabelle `discipline_main`
--
ALTER TABLE `discipline_main`
  ADD PRIMARY KEY (`iddisciplina`);

--
-- Indici per le tabelle `focusattr`
--
ALTER TABLE `focusattr`
  ADD UNIQUE KEY `attrliv` (`nomeattr`,`livelloattr`);

--
-- Indici per le tabelle `generazione`
--
ALTER TABLE `generazione`
  ADD PRIMARY KEY (`generazione`);

--
-- Indici per le tabelle `legami`
--
ALTER TABLE `legami`
  ADD UNIQUE KEY `uniq` (`domitor`,`target`),
  ADD KEY `domitor` (`domitor`),
  ADD KEY `target` (`target`);

--
-- Indici per le tabelle `lineedisangue`
--
ALTER TABLE `lineedisangue`
  ADD PRIMARY KEY (`idlds`);

--
-- Indici per le tabelle `log`
--
ALTER TABLE `log`
  ADD UNIQUE KEY `idx` (`data`);

--
-- Indici per le tabelle `logpx`
--
ALTER TABLE `logpx`
  ADD UNIQUE KEY `logpx_id` (`logpx_id`),
  ADD KEY `idutente` (`idutente`,`data`);

--
-- Indici per le tabelle `logscan`
--
ALTER TABLE `logscan`
  ADD PRIMARY KEY (`IDoggetto`,`IDutente`,`data`);

--
-- Indici per le tabelle `logscanfull`
--
ALTER TABLE `logscanfull`
  ADD PRIMARY KEY (`idscan`);

--
-- Indici per le tabelle `logscanogg`
--
ALTER TABLE `logscanogg`
  ADD UNIQUE KEY `scanuserogg` (`idoggetto`,`idutente`);

--
-- Indici per le tabelle `necromanzie`
--
ALTER TABLE `necromanzie`
  ADD UNIQUE KEY `tauidx` (`idnecro`,`idutente`);

--
-- Indici per le tabelle `necromanzie2`
--
ALTER TABLE `necromanzie2`
  ADD PRIMARY KEY (`idnecro2`);

--
-- Indici per le tabelle `necromanzie_main`
--
ALTER TABLE `necromanzie_main`
  ADD PRIMARY KEY (`idnecro`);

--
-- Indici per le tabelle `obiettivi`
--
ALTER TABLE `obiettivi`
  ADD UNIQUE KEY `idclan` (`idclan`,`IDcronaca`);

--
-- Indici per le tabelle `oggetti`
--
ALTER TABLE `oggetti`
  ADD PRIMARY KEY (`idoggetto`),
  ADD UNIQUE KEY `barcode` (`barcode`);

--
-- Indici per le tabelle `paired`
--
ALTER TABLE `paired`
  ADD UNIQUE KEY `IDoggetto1` (`IDoggetto1`,`IDoggetto2`);

--
-- Indici per le tabelle `personaggio`
--
ALTER TABLE `personaggio`
  ADD PRIMARY KEY (`idutente`),
  ADD KEY `nome` (`nomepg`),
  ADD KEY `pgcronaca` (`nomepg`,`IDcronaca`);

--
-- Indici per le tabelle `poteri`
--
ALTER TABLE `poteri`
  ADD UNIQUE KEY `idpotere` (`idpotere`,`idutente`);

--
-- Indici per le tabelle `poteri_main`
--
ALTER TABLE `poteri_main`
  ADD UNIQUE KEY `idpotere` (`idpotere`),
  ADD KEY `idxdisciplinalivello` (`iddisciplina`,`livellopot`);

--
-- Indici per le tabelle `pregidifetti`
--
ALTER TABLE `pregidifetti`
  ADD UNIQUE KEY `idpregio` (`idpregio`,`idutente`);

--
-- Indici per le tabelle `pregidifetti_main`
--
ALTER TABLE `pregidifetti_main`
  ADD PRIMARY KEY (`idpregio`);

--
-- Indici per le tabelle `risorse`
--
ALTER TABLE `risorse`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `rituali_n`
--
ALTER TABLE `rituali_n`
  ADD UNIQUE KEY `idrituale` (`idrituale`,`idutente`);

--
-- Indici per le tabelle `rituali_n_main`
--
ALTER TABLE `rituali_n_main`
  ADD PRIMARY KEY (`idrituale`);

--
-- Indici per le tabelle `rituali_t`
--
ALTER TABLE `rituali_t`
  ADD UNIQUE KEY `idrituale` (`idrituale`,`idutente`);

--
-- Indici per le tabelle `rituali_t_main`
--
ALTER TABLE `rituali_t_main`
  ADD PRIMARY KEY (`idrituale`);

--
-- Indici per le tabelle `rubrica`
--
ALTER TABLE `rubrica`
  ADD PRIMARY KEY (`idrubrica`),
  ADD KEY `owner` (`owner`);

--
-- Indici per le tabelle `segreteria`
--
ALTER TABLE `segreteria`
  ADD UNIQUE KEY `idutente` (`idutente`);

--
-- Indici per le tabelle `sentieri`
--
ALTER TABLE `sentieri`
  ADD PRIMARY KEY (`idsentiero`);

--
-- Indici per le tabelle `skill`
--
ALTER TABLE `skill`
  ADD UNIQUE KEY `IDSkill` (`idskill`,`idutente`);

--
-- Indici per le tabelle `skill_main`
--
ALTER TABLE `skill_main`
  ADD PRIMARY KEY (`idskill`);

--
-- Indici per le tabelle `statuscama`
--
ALTER TABLE `statuscama`
  ADD PRIMARY KEY (`idstatus`);

--
-- Indici per le tabelle `taumaturgie`
--
ALTER TABLE `taumaturgie`
  ADD UNIQUE KEY `tauidx` (`idtaum`,`idutente`);

--
-- Indici per le tabelle `taumaturgie2`
--
ALTER TABLE `taumaturgie2`
  ADD PRIMARY KEY (`idtaum2`);

--
-- Indici per le tabelle `taumaturgie_main`
--
ALTER TABLE `taumaturgie_main`
  ADD PRIMARY KEY (`idtaum`);

--
-- Indici per le tabelle `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`idutente`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `alleati`
--
ALTER TABLE `alleati`
  MODIFY `idalleato` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `background_main`
--
ALTER TABLE `background_main`
  MODIFY `idback` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `clan`
--
ALTER TABLE `clan`
  MODIFY `idclan` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `cond_oggetti`
--
ALTER TABLE `cond_oggetti`
  MODIFY `idcondizione` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `contatti`
--
ALTER TABLE `contatti`
  MODIFY `idcontatto` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `cronaca`
--
ALTER TABLE `cronaca`
  MODIFY `IDcronaca` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `dadi`
--
ALTER TABLE `dadi`
  MODIFY `ID` bigint(20) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `lineedisangue`
--
ALTER TABLE `lineedisangue`
  MODIFY `idlds` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `logpx`
--
ALTER TABLE `logpx`
  MODIFY `logpx_id` bigint(20) UNSIGNED NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `logscanfull`
--
ALTER TABLE `logscanfull`
  MODIFY `idscan` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `necromanzie2`
--
ALTER TABLE `necromanzie2`
  MODIFY `idnecro2` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `necromanzie_main`
--
ALTER TABLE `necromanzie_main`
  MODIFY `idnecro` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `oggetti`
--
ALTER TABLE `oggetti`
  MODIFY `idoggetto` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `poteri_main`
--
ALTER TABLE `poteri_main`
  MODIFY `idpotere` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `pregidifetti_main`
--
ALTER TABLE `pregidifetti_main`
  MODIFY `idpregio` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `risorse`
--
ALTER TABLE `risorse`
  MODIFY `id` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `rituali_n_main`
--
ALTER TABLE `rituali_n_main`
  MODIFY `idrituale` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `rituali_t_main`
--
ALTER TABLE `rituali_t_main`
  MODIFY `idrituale` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `rubrica`
--
ALTER TABLE `rubrica`
  MODIFY `idrubrica` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `sentieri`
--
ALTER TABLE `sentieri`
  MODIFY `idsentiero` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `skill_main`
--
ALTER TABLE `skill_main`
  MODIFY `idskill` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `taumaturgie2`
--
ALTER TABLE `taumaturgie2`
  MODIFY `idtaum2` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `taumaturgie_main`
--
ALTER TABLE `taumaturgie_main`
  MODIFY `idtaum` int(11) NOT NULL auto_increment;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `idutente` int(11) NOT NULL auto_increment;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
